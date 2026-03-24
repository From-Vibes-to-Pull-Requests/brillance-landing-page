import { readFile } from "fs/promises"
import path from "path"
import { parse as parseYaml } from "yaml"
import { PersonaRegistrySchema, PersonaSchema, type Persona } from "./schema"

const personasDir = path.join(process.cwd(), "data", "personas")

export async function loadRegistryPersonaIds(): Promise<string[]> {
  const raw = await readFile(path.join(personasDir, "registry.json"), "utf8")
  const json = JSON.parse(raw) as unknown
  const parsed = PersonaRegistrySchema.parse(json)
  return parsed.personaIds
}

export async function loadPersonaById(id: string): Promise<Persona> {
  const filePath = path.join(personasDir, `${id}.persona.yaml`)
  const raw = await readFile(filePath, "utf8")
  const data = parseYaml(raw) as unknown
  const persona = PersonaSchema.parse(data)
  if (persona.id !== id) {
    throw new Error(`Persona file id mismatch: file ${id}.persona.yaml has id ${persona.id}`)
  }
  return persona
}

export async function listPersonasForUi(): Promise<
  Pick<Persona, "id" | "displayName" | "segment">[]
> {
  const ids = await loadRegistryPersonaIds()
  const out: Pick<Persona, "id" | "displayName" | "segment">[] = []
  for (const id of ids) {
    const p = await loadPersonaById(id)
    out.push({ id: p.id, displayName: p.displayName, segment: p.segment })
  }
  return out
}
