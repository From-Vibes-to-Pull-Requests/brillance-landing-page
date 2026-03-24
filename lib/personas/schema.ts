import { z } from "zod"

export const PersonaSchema = z
  .object({
    id: z.string(),
    displayName: z.string(),
    segment: z.string().optional(),
    tenureMonths: z.number().optional(),
    maxEvidenceChars: z.number().optional(),
    productContext: z
      .object({
        name: z.string().optional(),
        relationship: z.string().optional(),
        summary: z.string().optional(),
      })
      .optional(),
    identity: z.string(),
    mission: z.string().optional(),
    goals: z.array(z.string()).optional(),
    aspirations: z.array(z.string()).optional(),
    voice: z
      .object({
        firstPersonDefault: z.boolean().optional(),
        tone: z.string().optional(),
        styleCaps: z.string().optional(),
      })
      .optional(),
    priorities: z.array(z.string()).optional(),
    decisionLens: z
      .array(
        z.object({
          rank: z.number(),
          criterion: z.string(),
          detail: z.string().optional(),
        }),
      )
      .optional(),
    adoptionState: z.record(z.unknown()).optional(),
    riskThresholds: z.record(z.unknown()).optional(),
    trialConditions: z.array(z.string()).optional(),
    conversionLevers: z.array(z.string()).optional(),
    abandonPermanentlyIf: z.string().optional(),
    responseModes: z
      .object({
        critique: z
          .object({
            when: z.string().optional(),
            steps: z.array(z.string()),
          })
          .optional(),
      })
      .optional(),
    guardrails: z
      .object({
        never: z.array(z.string()),
      })
      .optional(),
    dovetail: z
      .object({
        searchHints: z.array(z.string()).optional(),
        projectIds: z.array(z.string()).optional(),
        requiredLabels: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .passthrough()

export type Persona = z.infer<typeof PersonaSchema>

export const PersonaRegistrySchema = z.object({
  personaIds: z.array(z.string()).min(1).max(6),
})

export type PersonaRegistry = z.infer<typeof PersonaRegistrySchema>
