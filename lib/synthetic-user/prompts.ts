import type { Persona } from "@/lib/personas/schema"

function bullets(label: string, items: string[] | undefined): string {
  if (!items?.length) return ""
  return `${label}:\n${items.map((s) => `- ${s}`).join("\n")}\n`
}

function formatDecisionLens(persona: Persona): string {
  if (!persona.decisionLens?.length) return ""
  const lines = [...persona.decisionLens]
    .sort((a, b) => a.rank - b.rank)
    .map((d) => `${d.rank}) ${d.criterion}${d.detail ? ` — ${d.detail}` : ""}`)
  return `Decision lens (use in this order unless the user specifies otherwise):\n${lines.join("\n")}\n`
}

export function buildDovetailQuery(persona: Persona, userMessage: string): string {
  const hints = persona.dovetail?.searchHints?.join(" ") ?? ""
  const segment = persona.segment ?? ""
  const slice = userMessage.slice(0, 600)
  const labels = persona.dovetail?.requiredLabels
  const labelClause = labels?.length
    ? `Audience labels (research must match at least one): ${labels.map((l) => `"${l}"`).join(", ")}.`
    : ""
  return [hints, segment, labelClause, slice].filter(Boolean).join(" | ")
}

export function buildSystemPrompt(
  persona: Persona,
  options: { critiqueMode: boolean; evidenceText: string },
): string {
  const pc = persona.productContext
  const productLine = pc
    ? `Product context: ${pc.name ?? "Product"} (${pc.relationship ?? "user"}). ${pc.summary ?? ""}`.trim()
    : ""

  const voice = persona.voice
  const voiceBlock = [
    voice?.firstPersonDefault !== false
      ? "Speak as this persona in first-person (\"I\") unless the user explicitly asks for third-person analysis."
      : "Default to third-person unless the user asks for first-person.",
    voice?.tone ? `Tone: ${voice.tone}` : "",
    voice?.styleCaps ? `Style: ${voice.styleCaps}` : "",
  ]
    .filter(Boolean)
    .join("\n")

  const adoption = persona.adoptionState
  const adoptionBlock = adoption
    ? `Adoption / non-user mechanics (critical):\n${JSON.stringify(adoption, null, 2)}\n`
    : ""

  const critiqueSteps = persona.responseModes?.critique?.steps
  const critiqueBlock =
    options.critiqueMode && critiqueSteps?.length
      ? `For this turn, the user wants feedback or ideation. Follow this response structure:\n${critiqueSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n`
      : ""

  const guard = persona.guardrails?.never?.length
    ? `Never do:\n${persona.guardrails.never.map((g) => `- ${g}`).join("\n")}\n`
    : ""

  const requiredResearchLabels = persona.dovetail?.requiredLabels
  const researchLabelPolicy = requiredResearchLabels?.length
    ? `Research grounding policy: Only cite the Dovetail evidence as "what research says" when it clearly reflects participants tagged with at least one of: ${requiredResearchLabels.join(", ")}. If a snippet does not show those tags (or you are unsure), do not claim research support — answer from the persona spec and say the evidence is ambiguous.\n`
    : ""

  const evidenceSection =
    options.evidenceText.trim().length > 0
      ? `Evidence from research (Dovetail; ground answers here when relevant, and say when something is not supported by evidence):\n---\n${options.evidenceText}\n---\n`
      : "No research snippets were retrieved for this turn. Answer from the persona spec only, and clearly label anything uncertain as your inference.\n"

  return [
    `You are a synthetic user for product/marketing brainstorming. You are NOT the helpful assistant — you role-play "${persona.displayName}".`,
    persona.segment ? `Segment: ${persona.segment}` : "",
    persona.tenureMonths != null ? `Tenure (months): ${persona.tenureMonths}` : "",
    productLine,
    "",
    `Identity & mission:\n${persona.identity}`,
    persona.mission ? `\nMission:\n${persona.mission}` : "",
    "",
    bullets("Goals", persona.goals),
    bullets("Aspirations", persona.aspirations),
    voiceBlock,
    "",
    bullets("Core priorities", persona.priorities),
    formatDecisionLens(persona),
    adoptionBlock,
    persona.riskThresholds && Object.keys(persona.riskThresholds).length
      ? `Risk thresholds: ${JSON.stringify(persona.riskThresholds)}\n`
      : "",
    bullets("Trial / try conditions", persona.trialConditions),
    bullets("What would convince me", persona.conversionLevers),
    persona.abandonPermanentlyIf
      ? `I would abandon permanently if: ${persona.abandonPermanentlyIf}\n`
      : "",
    critiqueBlock,
    guard,
    "",
    researchLabelPolicy,
    evidenceSection,
  ]
    .filter((block) => block !== "")
    .join("\n")
}
