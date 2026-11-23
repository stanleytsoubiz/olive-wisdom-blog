import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext configuration for Cloudflare Workers.
 *
 * Uses defineCloudflareConfig() which:
 * - Sets wrapper: "cloudflare-node" for the server function
 * - Sets wrapper: "cloudflare-edge" for middleware
 * - Enables cloudflare.useWorkerdCondition: true (required for esbuild alias compat)
 * - Defaults all caches to "dummy" (no R2/KV required)
 *
 * buildCommand: OpenNext's default build command is `npm run build`,
 * which for this repo is the STATIC export pipeline — bundling a static
 * export fails (no server bundle). The server build therefore goes
 * through `scripts/build.mjs server`, which sets OW_BUILD_TARGET=cf
 * (see next.config.js) and runs the posts-data + cover-optimisation
 * prepare steps before `next build`. `npm run build` (the live Pages
 * pipeline) is untouched.
 */
const config = defineCloudflareConfig();
config.buildCommand = "node scripts/build.mjs server";

export default config;
