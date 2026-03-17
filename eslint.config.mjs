import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // App Router uses layout.tsx for fonts; no _document.js.
      "@next/next/no-page-custom-font": "off",
      // Use of <img> is intentional (external URLs, unoptimized config).
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"]),
])

export default eslintConfig
