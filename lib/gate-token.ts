export const SYNTHETIC_USER_COOKIE_NAME = "su_gate"

export async function expectedGateCookieValue(password: string): Promise<string> {
  const data = new TextEncoder().encode(`v1|${password}`)
  const digest = await crypto.subtle.digest("SHA-256", data)
  const bytes = new Uint8Array(digest)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function cookieMatchesGate(
  cookie: string | undefined,
  password: string,
): Promise<boolean> {
  if (!cookie) return false
  const expected = await expectedGateCookieValue(password)
  return timingSafeEqualString(cookie, expected)
}

function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return out === 0
}
