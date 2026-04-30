import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * OpenNext configuration for Cloudflare Pages
 *
 * Uses defineCloudflareConfig() which:
 * - Sets wrapper: "cloudflare-node" for the server function
 * - Sets wrapper: "cloudflare-edge" for middleware
 * - Enables cloudflare.useWorkerdCondition: true (required for esbuild alias compat)
 * - Defaults all caches to "dummy" (no R2/KV required)
 */
export default defineCloudflareConfig();
