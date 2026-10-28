# NOVA implementation and verification

## Marketplace and admin update — 2026-10-28

- Alibaba-inspired NOVA marketplace layout: prominent search, category navigation, compact product cards, consistent MNT prices, responsive desktop/mobile layouts.
- Always-visible Admin entry in the header, mobile menu and footer. Login preserves `/admin`; non-admin accounts get an explanatory page showing their own signed-in email.
- Existing verified owner `ch4rmont@gmail.com` remains admin. No email-based automatic privilege grants.
- Mongolian product editor supports create/edit, price and stock, multiple image uploads, primary-image selection/removal, source information and visibility.
- Images upload directly to Supabase Storage under admin RLS (JPEG/PNG/WebP, 5 MB each, 10 per product), avoiding server-action file-size limits.
- Catalog writes are transactional. Quick price/stock updates and reversible hide/publish preserve order history.
- Build and typecheck passed. SQL tests verify actual owner access, atomic rollback, catalog changes and customer write denial. Browser tests verify login/dashboard, image upload, product creation, full editing and quick price/stock persistence.
- Hosted Auth Confirm email and leaked-password protection still require dashboard configuration. Payment remains cash on delivery; no online payment credentials were supplied.

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
# Account update — 2026-10-20

- Redesigned responsive account overview and profile form; real order/favorite/address counts.
- Saved addresses support create, edit, delete and an atomic default selection; checkout uses saved addresses and profile details.
- Owner admin access is bound to the existing verified user ID, never merely an email claim.
- Added 3 researched JD products (11 total), 6 supplier photos and documented landed-cost estimates with approximately 35% markup. All remain clearly marked preorders, with no invented on-hand stock.
- Account SQL regression checks passed: address creation/edit/default, favorites, cross-user isolation, and owner email spoof rejection. Fixtures rolled back.
- TypeScript, lint and production build passed for account changes.
- Pending: hosted Supabase Confirm email remains ON. The connected database tools cannot change hosted Auth configuration. NOVA dashboard → Authentication → Sign In / Providers → Email → Confirm email OFF → Save. No LinguaFlow changes.
- Browser-level signed-in account flow has not been re-tested in this update.
