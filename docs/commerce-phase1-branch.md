# Commerce Phase 1 — feature branch notes

Branch: `ecommerce-phase1-20261122` · Status: **sandbox build only — DO NOT MERGE, DO NOT DEPLOY selling features.**

Owner directives in force (2026-11-22): no product listing before product
research & screening are complete and the owner approves the list; no
same-batch CoA, no listing. All product data on this branch is obvious
placeholder/test data.

## What is on this branch

| Piece | Path |
|---|---|
| DB schema (products / orders / order_items / payments, RLS on, service-role only) | `supabase/migrations/20261122000000_commerce_phase1.sql` (not applied anywhere) |
| Placeholder test catalog (NT$100 test item) | `src/lib/commerce/products.ts` |
| ECPay AIO: CheckMacValue sign/verify, checkout params, sandbox config | `src/lib/commerce/ecpay.ts` |
| Order store (Supabase service-role + in-memory for tests) | `src/lib/commerce/orders.ts` |
| Checkout API (create order → signed ECPay params) | `src/app/api/checkout/route.ts` |
| ECPay webhook (verify → mark paid → `1|OK`, idempotent) | `src/app/api/webhooks/ecpay/route.ts` |
| Product page skeleton + Buy Now (hosted checkout, no cart) | `src/app/shop/[slug]/page.tsx`, `src/components/BuyNowButton.tsx` |
| Payment-result landing page | `src/app/checkout/result/page.tsx` |
| Sandbox test chain | `scripts/test-ecpay-chain.mjs` (+ `.entry.ts`) |

## Test chain result (2026-11-22)

`node scripts/test-ecpay-chain.mjs` — **7/7 PASS**: order created pending →
checkout params signed & self-verified → simulated ECPay success callback
signature verified → tampered callback rejected → order marked paid →
duplicate callback idempotent. Uses ECPay's official public stage credentials
(MerchantID 2000132) from `ECPAY_SANDBOX`; a live browser round-trip against
payment-stage.ecpay.com.tw is still outstanding (needs the server build
deployed to a test URL — do it together with the OpenNext workers.dev test).

## Build modes on this branch

- `npm run build:cf` (server/OpenNext) — **passes** (pagefind guard 55/55).
- `npm run build` (static export) — **fails by design**: POST route handlers
  cannot exist in a static export (`Failed to collect page data for
  /api/checkout`). This branch only becomes mergeable after the OpenNext
  switch retires the static build.

## Still missing before go-live (external conditions)

1. Owner approves the screened product list (screening report first).
2. Same-batch CoA (six values) obtained and verified per product.
3. Importer agreement signed (fulfilment, returns, revenue share).
4. Taipei company incorporated + tax registration + company bank account.
5. ECPay merchant account (production MerchantID/HashKey/HashIV via env vars:
   `ECPAY_ENV=production`, `ECPAY_MERCHANT_ID`, `ECPAY_HASH_KEY`, `ECPAY_HASH_IV`).
6. Supabase migration applied + `SUPABASE_SERVICE_ROLE_KEY` set in Worker env.
7. OpenNext production switch completed (owner's 4 steps).
8. Store pages required by ECPay review: product/refund/privacy/terms/contact
   (privacy/terms/contact exist; a commerce-specific refund policy page is
   still to be written).
