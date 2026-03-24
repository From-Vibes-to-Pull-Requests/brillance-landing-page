import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { z } from "zod"
import { searchWorkspaceEvidence } from "@/lib/dovetail/mcp-client"
import { loadPersonaById } from "@/lib/personas/load"
import { buildDovetailQuery, buildSystemPrompt } from "@/lib/synthetic-user/prompts"
import { resolveCritiqueMode, type ChatMode } from "@/lib/synthetic-user/critique"

export const runtime = "nodejs"
export const maxDuration = 60

const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
})

const BodySchema = z.object({
  personaId: z.string(),
  messages: z.array(MessageSchema).min(1),
  mode: z.enum(["default", "critique"]).optional(),
})

function encodeEvidenceHeader(payload: unknown): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url")
}

export async function POST(request: Request) {
  let parsed: z.infer<typeof BodySchema>
  try {
    const json = (await request.json()) as unknown
    parsed = BodySchema.parse(json)
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    })
  }

  const { personaId, messages, mode } = parsed

  let persona
  try {
    persona = await loadPersonaById(personaId)
  } catch {
    return new Response(JSON.stringify({ error: "Unknown persona" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    })
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user")
  const latestUserText = lastUser?.content ?? ""
  const explicitMode = mode as ChatMode | undefined
  const critiqueMode = resolveCritiqueMode(latestUserText, explicitMode)

  const maxEvidence = persona.maxEvidenceChars ?? 8000
  const dovetailToken = process.env.DOVETAIL_API_TOKEN
  const searchQuery = buildDovetailQuery(persona, latestUserText)

  let evidenceText = ""
  let evidenceMeta: Record<string, unknown> = {
    query: searchQuery,
    truncated: false,
    preview: "",
  }

  if (!dovetailToken) {
    evidenceText =
      "(Dovetail not configured: set DOVETAIL_API_TOKEN on the server to retrieve workspace evidence.)"
    evidenceMeta = { ...evidenceMeta, skipped: true, reason: "missing_token" }
  } else {
    const requiredLabels = persona.dovetail?.requiredLabels
    const ev = await searchWorkspaceEvidence(dovetailToken, searchQuery, maxEvidence, {
      requiredLabels,
    })
    const schemaMismatch =
      Boolean(requiredLabels?.length) &&
      !(ev.appliedLabelPaths && ev.appliedLabelPaths.length > 0) &&
      ev.text.trim().length > 0

    evidenceText = ev.text
    if (schemaMismatch) {
      evidenceText =
        "[Note: The workspace search tool did not accept label filters in its published schema; snippets may include other audiences. Only treat lines as research-backed if they clearly match an allowed tag.]\n\n" +
        ev.text
    }
    evidenceMeta = {
      query: ev.query,
      truncated: ev.truncated,
      preview: ev.text.slice(0, 1500),
      error: ev.error,
      requiredLabels: requiredLabels ?? [],
      appliedLabelPaths: ev.appliedLabelPaths ?? [],
      searchToolMissing: ev.searchToolMissing ?? false,
      labelFilterSchemaMismatch: schemaMismatch,
    }
    if (!ev.text && ev.error) {
      evidenceText = `(Dovetail retrieval failed: ${ev.error})`
    }
  }

  const system = buildSystemPrompt(persona, { critiqueMode, evidenceText })

  const coreMessages = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }))

  const modelId = process.env.OPENAI_MODEL ?? "gpt-4o-mini"

  const result = streamText({
    model: openai(modelId),
    system,
    messages: coreMessages,
  })

  return result.toTextStreamResponse({
    headers: {
      "X-Synthetic-Evidence": encodeEvidenceHeader(evidenceMeta),
      "X-Synthetic-Critique-Mode": critiqueMode ? "1" : "0",
    },
  })
}
