# Brillance Landing Page

Marketing landing page for **Brillance** — effortless custom contract billing. Streamline your billing process with seamless automation for every custom contract.

## Tech stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Radix UI** (via shadcn/ui-style components)
- **Vercel Analytics**
- **Synthetic user lab** (`/synthetic-users`) — persona YAML + OpenAI + optional Dovetail MCP

## Synthetic user lab

Internal-style chat at **`/synthetic-users`**: pick a persona (up to six, driven by [`data/personas/registry.json`](data/personas/registry.json)), chat in character, and ground replies with **Dovetail** via `search_workspace` when a server token is set. Each turn the server calls `tools/list`, reads `search_workspace`’s input schema, and passes persona `dovetail.requiredLabels` into any matching label/tag array fields the tool exposes; the semantic query also names those labels. If the hosted schema has no label fields, a short warning is prepended to evidence and the model is instructed to cite research only when tags match.

### Environment variables (server-only)

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `OPENAI_API_KEY` | Yes, for chat | LLM provider (OpenAI). Model defaults to `gpt-4o-mini`; override with `OPENAI_MODEL`. |
| `DOVETAIL_API_TOKEN` | No | Bearer token for [Dovetail MCP](https://developers.dovetail.com/docs/mcp) at `https://dovetail.com/api/mcp`. If unset, the app still runs but shows a clear “not configured” notice instead of research snippets. |
| `SYNTHETIC_USERS_PASSWORD` | No | If set, **middleware** requires a successful sign-in at `/synthetic-users/gate` (HTTP-only cookie). If unset, routes are open (useful for local dev). |

Copy [`.env.example`](.env.example) to `.env.local` and fill in values.

### Personas

- Add `data/personas/{id}.persona.yaml` and list `id` in `registry.json` (max 6).
- Start from [`data/personas/_template.persona.yaml`](data/personas/_template.persona.yaml).
- Commuting Carl is included as [`data/personas/commuting-carl.persona.yaml`](data/personas/commuting-carl.persona.yaml).

## Getting started

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

Runs the production build. Run `npm run build` first.

### Lint

```bash
npm run lint
```

## Project structure

- **`app/`** — Next.js App Router (layout, page, global styles)
- **`components/`** — React components (hero, pricing, FAQ, testimonials, CTA, footer, UI primitives)
- **`hooks/`** — Custom React hooks (e.g. toast, mobile detection)
- **`lib/`** — Utilities (e.g. `utils.ts` for `cn`), plus `personas/`, `dovetail/`, `synthetic-user/`
- **`data/personas/`** — Persona YAML + `registry.json` (max 6 agents)
- **`public/`** — Static assets (images, icons, patterns)
- **`styles/`** — Global CSS

## Sections

The landing page includes:

- Hero with rotating dashboard preview
- Social proof and logo grid
- Bento grid: Smart. Simple. Brilliant. / Your work, in sync / Effortless integration / Numbers that speak
- Documentation
- Testimonials
- Pricing
- FAQ
- CTA and footer
