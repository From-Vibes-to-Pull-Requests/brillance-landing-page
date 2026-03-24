"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

type UiPersona = { id: string; displayName: string; segment?: string }

type ChatMessage = { role: "user" | "assistant"; content: string }

function decodeEvidenceHeader(header: string | null): Record<string, unknown> | null {
  if (!header) return null
  try {
    let b64 = header.replace(/-/g, "+").replace(/_/g, "/")
    const pad = b64.length % 4
    if (pad) b64 += "=".repeat(4 - pad)
    const json = atob(b64)
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

export function SyntheticUsersApp() {
  const [personas, setPersonas] = useState<UiPersona[]>([])
  const [personaId, setPersonaId] = useState<string>("")
  const [loadError, setLoadError] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [streamText, setStreamText] = useState("")
  const [evidence, setEvidence] = useState<Record<string, unknown> | null>(null)
  const [critiqueMode, setCritiqueMode] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/synthetic-user/personas")
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: string } | null
          throw new Error(body?.error ?? `Failed to load personas (${res.status})`)
        }
        const data = (await res.json()) as { personas: UiPersona[] }
        if (cancelled) return
        setPersonas(data.personas)
        if (data.personas[0]) {
          setPersonaId((prev) => prev || data.personas[0].id)
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : "Failed to load personas")
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const activePersona = useMemo(
    () => personas.find((p) => p.id === personaId),
    [personas, personaId],
  )

  const send = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || !personaId || sending) return

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }]
    setMessages(nextMessages)
    setInput("")
    setSending(true)
    setStreamText("")
    setEvidence(null)

    try {
      const res = await fetch("/api/synthetic-user/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          personaId,
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          mode: critiqueMode ? "critique" : "default",
        }),
      })

      setEvidence(decodeEvidenceHeader(res.headers.get("X-Synthetic-Evidence")))

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "")
        throw new Error(errText || `Request failed (${res.status})`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setStreamText(acc)
      }

      setMessages((prev) => [...prev, { role: "assistant", content: acc }])
      setStreamText("")
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong"
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Sorry — I couldn’t respond. ${msg}` },
      ])
      setStreamText("")
    } finally {
      setSending(false)
    }
  }, [critiqueMode, input, messages, personaId, sending])

  if (loadError) {
    return (
      <div className="min-h-svh flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Couldn’t load synthetic users</CardTitle>
            <CardDescription>{loadError}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Synthetic users</h1>
            <p className="text-sm text-muted-foreground">
              Persona-backed feedback for product and marketing ideation (Dovetail-grounded).
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Back to site</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        {personas.length === 0 ? (
          <p className="text-sm text-muted-foreground">Loading personas…</p>
        ) : (
          <Tabs value={personaId} onValueChange={setPersonaId} className="w-full">
            <TabsList
              className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/60 p-1"
              aria-label="Personas"
            >
              {personas.map((p) => (
                <TabsTrigger
                  key={p.id}
                  value={p.id}
                  className="max-w-full shrink text-left text-xs sm:text-sm"
                >
                  {p.displayName}
                </TabsTrigger>
              ))}
            </TabsList>
            {personas.map((p) => (
              <TabsContent key={p.id} value={p.id} className="mt-4">
                <p className="text-sm text-muted-foreground">
                  {p.segment ?? "Synthetic user persona"}
                </p>
              </TabsContent>
            ))}
          </Tabs>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card className="flex min-h-[420px] flex-col">
            <CardHeader className="space-y-1 pb-3">
              <CardTitle className="text-base">
                Chat with {activePersona?.displayName ?? "…"}
              </CardTitle>
              <CardDescription>
                Ask for reactions, feedback, or ideation. Critique structure can be forced on
                with the toggle below.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 px-3 py-2">
                <div className="space-y-0.5">
                  <Label htmlFor="critique-mode" className="text-sm font-medium">
                    Critique / ideation structure
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Restate, lens, friction, verdict, adjustments (per persona).
                  </p>
                </div>
                <Switch
                  id="critique-mode"
                  checked={critiqueMode}
                  onCheckedChange={setCritiqueMode}
                  disabled={sending}
                />
              </div>

              <ScrollArea className="min-h-[220px] flex-1 rounded-md border border-border bg-muted/20 p-3">
                <div className="space-y-3 pr-2">
                  {messages.length === 0 && !sending ? (
                    <p className="text-sm text-muted-foreground">
                      Start by describing an idea, campaign, or mock. This agent answers in
                      character and uses Dovetail evidence when configured.
                    </p>
                  ) : null}
                  {messages.map((m, i) => (
                    <div
                      key={`${i}-${m.role}`}
                      className={
                        m.role === "user"
                          ? "ml-6 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                          : "mr-6 rounded-lg border border-border bg-card px-3 py-2 text-sm"
                      }
                    >
                      <p className="text-[10px] font-medium uppercase tracking-wide opacity-70">
                        {m.role === "user" ? "You" : activePersona?.displayName ?? "Persona"}
                      </p>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>
                  ))}
                  {sending && streamText ? (
                    <div className="mr-6 rounded-lg border border-dashed border-border bg-card/60 px-3 py-2 text-sm text-muted-foreground">
                      <p className="text-[10px] font-medium uppercase tracking-wide opacity-70">
                        {activePersona?.displayName ?? "Persona"}
                      </p>
                      <p className="whitespace-pre-wrap">{streamText}</p>
                    </div>
                  ) : null}
                </div>
              </ScrollArea>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. We’re launching an in-app nudge when users open Concur…"
                  rows={3}
                  disabled={sending || !personaId}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault()
                      void send()
                    }
                  }}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    onClick={() => void send()}
                    disabled={sending || !input.trim() || !personaId}
                  >
                    {sending ? "Thinking…" : "Send"}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Tip: ⌘/Ctrl + Enter to send.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit lg:sticky lg:top-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Evidence preview</CardTitle>
              <CardDescription>
                Snippet from the last Dovetail search (full text is in the model context).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {!evidence ? (
                <p className="text-muted-foreground">Send a message to retrieve evidence.</p>
              ) : (
                <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap rounded-md bg-muted/40 p-2 text-xs leading-relaxed">
                  {JSON.stringify(evidence, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
