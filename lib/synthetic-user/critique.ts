const CRITIQUE_HINT =
  /\b(feedback|ideat|ideation|critique|review|brainstorm|campaign|marketing|adoption|verdict|what do you think|react to)\b/i

export type ChatMode = "default" | "critique"

export function resolveCritiqueMode(
  latestUserText: string,
  explicit?: ChatMode,
): boolean {
  if (explicit === "critique") return true
  if (explicit === "default") return false
  return CRITIQUE_HINT.test(latestUserText)
}
