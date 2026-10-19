# NOVA implementation and verification

2026-10-19. Dedicated database: `gskzwsbootemeibfhltp`. LinguaFlow was not modified.

## Implemented
- Build/type mismatch fixed; Node 24 pinned and npm lockfile committed.
- Mongolian responsive storefront and all four requested categories.
- Eight exact JD listings, 16 downloaded real product photographs and source records.
- Costed prices include estimated domestic freight, international freight, handling and other-cost reserve, then 35% markup with 500 MNT rounding.
- Product details, search/filter, favorites, durable cart, authenticated COD checkout.
- Customer account, addresses and orders; RLS-protected admin, products, images, categories, sourcing costs, order states and stock.
- Explicit preorders: physical stock remains zero until verified inventory is entered.
- Private, authenticated atomic order creation with duplicate-line aggregation and idempotency.
- Only actual stock reservations are restored on cancellation.
- Owner admin access bound to the connected GitHub email, verified through Supabase Auth.

## Verified
- npm run lint: PASS, zero errors or warnings.
- npm run typecheck: PASS.
- npm run build: PASS (Next.js 16.4.2).
- Supabase security advisor: no findings.
- tests/commerce.sql: PASS (ownership, RLS, idempotency, overselling, cancellation, preorders; fixtures rolled back).
- Direct Auth API: confirmed test user password sign-in PASS; catalog 8 products; customer sourcing rows hidden.

## Pending external setup
- Online payment provider/merchant credentials: not supplied; active checkout is unpaid cash on delivery.
- Supabase Auth production Site URL/redirect settings and real-mailbox signup/recovery delivery require dashboard configuration/verification. Exposed connector cannot edit those settings.
- Taobao listing verification was unavailable; no invented Taobao prices used.
- Lead times, packed weights, freight quotations and other-cost reserve must be confirmed with suppliers/carrier.

See README.md for the exact deployment target and setup instructions.
