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
 * buildCommand: OpenNext's default build is `npm run build`, but that runs
 * the static-export wrapper (scripts/build.mjs static) — a server build
 * must run instead. NOTE: buildCommand CANNOT be passed INTO
 * defineCloudflareConfig() — that function only accepts cache overrides
 * and silently drops anything else. It has to be spread onto the returned
 * object as a top-level OpenNextConfig field (verified against
 * @opennextjs/aws buildNextApp: `config.buildCommand ?? "npm run build"`).
 * `node scripts/build.mjs server` = prepare (posts data + WebP covers) →
 * `next build` → restore rewritten files, same wrapper guarantees as
 * the static mode.
 */
export default {
  ...defineCloudflareConfig(),
  buildCommand: "node scripts/build.mjs server",
};
