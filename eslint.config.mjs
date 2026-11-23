// ESLint flat config — Next 16 removed `next lint` and the built-in
// ESLint integration; lint now runs standalone via `npm run lint`
// (`eslint .`). Config follows the Next 16 docs setup:
// eslint-config-next/core-web-vitals + /typescript as flat configs.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Conventional underscore handling: `_`-prefixed args/vars and the
  // rest-sibling of a destructured omission (e.g. stripping `content`
  // in lib/posts.ts) are intentional, not dead code.
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  // Legacy CommonJS build scripts (scripts/*.js) legitimately use require();
  // the typescript flat config bans it by default.
  {
    files: ["scripts/**/*.js"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Committed build output (384 stale .open-next/ files are tracked in
    // main from before 2026-11-22; never lint generated bundles):
    ".open-next/**",
  ]),
]);

export default eslintConfig;
