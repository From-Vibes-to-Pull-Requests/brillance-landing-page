import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js"
import {
  buildSearchWorkspaceArguments,
  type ToolInputSchema,
} from "@/lib/dovetail/build-search-workspace-args"

const DOVETAIL_MCP_URL = "https://dovetail.com/api/mcp"

export type DovetailEvidenceResult = {
  query: string
  text: string
  truncated: boolean
  error?: string
  /** Paths on the tool call where persona requiredLabels were passed (from inputSchema). */
  appliedLabelPaths?: string[]
  /** True when search_workspace was missing from tools/list (unexpected). */
  searchToolMissing?: boolean
}

function truncate(text: string, maxChars: number): { text: string; truncated: boolean } {
  if (text.length <= maxChars) return { text, truncated: false }
  return { text: text.slice(0, maxChars) + "\n…[truncated]", truncated: true }
}

async function listAllTools(client: Client) {
  const tools: Awaited<ReturnType<Client["listTools"]>>["tools"] = []
  let cursor: string | undefined
  for (let page = 0; page < 20; page++) {
    const res = await client.listTools(cursor ? { cursor } : undefined)
    tools.push(...res.tools)
    cursor = res.nextCursor
    if (!cursor) break
  }
  return tools
}

function contentBlocksToText(content: unknown): string {
  if (!Array.isArray(content)) return ""
  const parts: string[] = []
  for (const block of content) {
    if (!block || typeof block !== "object") continue
    const b = block as { type?: string; text?: string }
    if (b.type === "text" && typeof b.text === "string") parts.push(b.text)
  }
  return parts.join("\n\n")
}

export type SearchWorkspaceEvidenceOptions = {
  requiredLabels?: string[]
}

export async function searchWorkspaceEvidence(
  apiToken: string,
  query: string,
  maxChars: number,
  options?: SearchWorkspaceEvidenceOptions,
): Promise<DovetailEvidenceResult> {
  const client = new Client({ name: "brillance-synthetic-user", version: "0.1.0" })
  const transport = new StreamableHTTPClientTransport(new URL(DOVETAIL_MCP_URL), {
    requestInit: {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    },
  })

  try {
    await client.connect(transport)

    const tools = await listAllTools(client)
    const searchTool = tools.find((t) => t.name === "search_workspace")
    if (!searchTool) {
      return {
        query,
        text: "",
        truncated: false,
        error: "Dovetail MCP tools/list did not include search_workspace",
        searchToolMissing: true,
      }
    }

    const schema = searchTool.inputSchema as ToolInputSchema | undefined
    const { args, appliedLabelPaths } = buildSearchWorkspaceArguments(
      query,
      options?.requiredLabels,
      schema,
    )

    const result = await client.callTool({
      name: "search_workspace",
      arguments: args,
    })

    if (result.isError) {
      return {
        query,
        text: "",
        truncated: false,
        error: "Dovetail search_workspace returned isError=true",
        appliedLabelPaths,
      }
    }

    const raw = contentBlocksToText(result.content)
    const { text, truncated } = truncate(raw, maxChars)
    return { query, text, truncated, appliedLabelPaths }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return {
      query,
      text: "",
      truncated: false,
      error: message,
    }
  } finally {
    try {
      await transport.terminateSession()
    } catch {
      // ignore — server may not support DELETE
    }
    try {
      await client.close()
    } catch {
      // ignore
    }
  }
}
