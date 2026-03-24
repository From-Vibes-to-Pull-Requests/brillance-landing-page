/**
 * Builds `search_workspace` tool arguments from the tool's published inputSchema.
 * Hosted Dovetail MCP may expose label/tag filters under different property names;
 * we map `requiredLabels` when the schema includes a matching array field.
 */

export type ToolInputSchema = {
  type?: string
  properties?: Record<string, JsonSchemaProperty>
  required?: string[]
}

type JsonSchemaProperty = {
  type?: string
  items?: JsonSchemaProperty
  properties?: Record<string, JsonSchemaProperty>
  description?: string
}

const QUERY_KEYS = ["query", "q", "search_query", "text", "prompt", "input"] as const

const TOP_LEVEL_LABEL_KEYS = [
  "labels",
  "label_names",
  "tags",
  "tag_names",
  "workspace_labels",
  "tag_ids",
  "label_ids",
] as const

const NESTED_FILTER_LABEL_KEYS = [
  "labels",
  "label_names",
  "tags",
  "tag_names",
  "workspace_labels",
] as const

function isArrayish(prop: JsonSchemaProperty | undefined): boolean {
  if (!prop) return false
  return prop.type === "array" || prop.type === undefined
}

function firstQueryKey(properties: Record<string, JsonSchemaProperty>): string | undefined {
  for (const k of QUERY_KEYS) {
    if (properties[k] !== undefined) return k
  }
  return undefined
}

function buildFilterSubset(
  filterProps: Record<string, JsonSchemaProperty>,
  requiredLabels: string[],
): Record<string, unknown> | null {
  const out: Record<string, unknown> = {}
  for (const k of NESTED_FILTER_LABEL_KEYS) {
    const prop = filterProps[k]
    if (prop && isArrayish(prop)) {
      out[k] = requiredLabels
    }
  }
  return Object.keys(out).length > 0 ? out : null
}

export function buildSearchWorkspaceArguments(
  semanticQuery: string,
  requiredLabels: string[] | undefined,
  inputSchema: ToolInputSchema | undefined,
): { args: Record<string, unknown>; queryKey: string; appliedLabelPaths: string[] } {
  const props = inputSchema?.properties ?? {}
  const appliedLabelPaths: string[] = []

  const queryKey = firstQueryKey(props) ?? "query"
  const args: Record<string, unknown> = { [queryKey]: semanticQuery }

  const labels = requiredLabels?.filter((s) => s.trim().length > 0) ?? []
  if (labels.length === 0) {
    return { args, queryKey, appliedLabelPaths }
  }

  for (const k of TOP_LEVEL_LABEL_KEYS) {
    const prop = props[k]
    if (prop && isArrayish(prop)) {
      args[k] = labels
      appliedLabelPaths.push(k)
    }
  }

  const filterProp = props.filter
  if (filterProp?.properties) {
    const nested = buildFilterSubset(filterProp.properties, labels)
    if (nested) {
      args.filter = nested
      for (const k of Object.keys(nested)) {
        appliedLabelPaths.push(`filter.${k}`)
      }
    }
  }

  return { args, queryKey, appliedLabelPaths }
}
