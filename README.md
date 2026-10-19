# NOVA Shop · Монгол онлайн дэлгүүр

Next.js 16 / React 19 / Supabase. GitHub: `ch4rmont-ship-it/nova-shop`.

## Live infrastructure

- Vercel project: `nova-shop` (`prj_uOjZ0pmgKVpuCanyEpYLlBpbcNiD`).
- Production: https://nova-shop-2fdg74zn4f-2062s-projects.vercel.app
- Dedicated Supabase project: `gskzwsbootemeibfhltp` (Seoul).
- LinguaFlow / lingo-quest and the previous Supabase project are outside this repository's scope. Never apply NOVA SQL to them.

## Features

Responsive Mongolian storefront, DRIVE / DESK / ORGANIZE / CARRY categories, search/filter/sort, real supplier photographs, product details, favorites, persisted guest cart and signed-in cart synchronization, email/password accounts, customer addresses and order history, admin product/category/image management, sourcing cost dashboard, fulfilment and stock control.

Checkout requires sign-in and creates an **unpaid cash-on-delivery order**. It does not claim that an online payment occurred. Server/database calculate the total. Delivery is 12,000 MNT, free from 150,000 MNT. Admin records payment only after money is actually received.

Catalog products are explicitly **preorders**, with on-hand stock 0. The estimated lead time of 10–21 days must be confirmed operationally. Set `preorder=false` and enter verified stock through admin when physical inventory arrives. Preorders never decrement or restore imaginary on-hand inventory.

Order creation aggregates duplicate product IDs, locks rows in a consistent order, reserves real stock atomically, and uses a per-customer idempotency UUID. Cancellation restores only the actual reservation, once. Customers cannot write order totals, payment states or admin roles directly.

## Local development

```sh
npm ci
cp .env.example .env.local
npm run dev -- -H 127.0.0.1
```

Required public configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=https://gskzwsbootemeibfhltp.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
```

Only publishable credentials are required for the active storefront, account, COD checkout and interactive admin flows. Admin uses the signed-in session and database RLS, not an unrestricted service key.

## Authentication settings

In the **NOVA project only**, set Supabase Authentication → URL Configuration:

- Site URL: `https://nova-shop-2fdg74zn4f-2062s-projects.vercel.app`
- Allowed redirect URLs: `https://nova-shop-2fdg74zn4f-2062s-projects.vercel.app/auth/confirm`, `http://127.0.0.1:3000/auth/confirm`.

Email confirmation remains enabled. Before sending paid traffic, verify signup confirmation and password recovery using your real mailbox and configure a production SMTP sender. Provider redirect settings cannot be updated by the currently exposed Supabase connector.

The owner account is bound to the verified connected GitHub email `ch4rmont@gmail.com`. Register that email, confirm it, then open `/account` or `/admin`. The database grants admin only when Supabase verifies that exact mailbox. Other users cannot choose an admin email or role through metadata. No password is pre-created for the owner.

## Database setup for a NEW NOVA project

Apply the current files in `supabase/migrations/` in filename order. Do not run files in `docs/archive/`: they are obsolete demo seeds and contain destructive replacement operations. The dedicated live NOVA database already has the current schema and catalog applied through the connector; do not replay the initial schema there.

All exposed tables use RLS. Sensitive sourcing costs live in `product_sourcing`, readable by admins only. Public supplier links are separate from private cost data. Privileged order/owner functions live in `private`, with explicit caller checks and minimal grants. Public wrappers are security invoker.

## Sourcing and pricing

See `docs/sourcing.json` for the eight exact JD listings, observed CNY prices, original image URLs and per-item cost calculations. Photographs are downloaded into `public/products/`; they are not AI-generated. Taobao could not be verified from this environment, so no Taobao price is presented as checked.

Planning assumptions (not freight quotes or a tax assessment):

- FX: 538.5 MNT/CNY (rounded reference on 2026-10-19).
- China domestic freight: 6 CNY per item.
- International freight: 10,000 MNT/kg × estimated packed weight.
- Packaging/handling: 1,500 MNT.
- Other cost reserve: 15% × (purchase + domestic freight + international freight).
- Retail: `ceil(landed_cost × 1.35 / 500) × 500` MNT.

Markup is on total estimated landed cost, not just purchase cost. Markup is not profit margin. Replace estimated weights, carrier costs and the reserve with actual purchasing/import invoices before committing to commercial prices. Supplier prices, coupon eligibility and photography usage rights should be confirmed with the selected supplier before purchasing/advertising.

To refresh exact listing photographs and source records deliberately:

```sh
python scripts/source-catalog.py
```

The eight observed reference prices are explicit inputs to that script; it does not pretend to discover authenticated coupon prices.

## Validation

```sh
npm run lint
npm run typecheck
npm run build
```

`tests/commerce.sql` exercises RLS/owner restrictions, idempotency, duplicate-line overselling, cancellation and preorder inventory inside a rollback transaction. Run it only against NOVA.

## Optional online payment integration

The active checkout is COD. QPay/card collection is **not configured**. The older Stripe webhook module remains disabled without its server-only secrets; it is not the active checkout path. Do not enable it without updating and retesting payment creation, currency units, webhook verification, expiry/recovery and refunds end to end. Never put payment secrets in `NEXT_PUBLIC_*`, git, or chat; configure them through Vercel's environment settings. Choose a payment provider and merchant account before activating online collection.
