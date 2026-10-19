# NOVA Commerce architecture

## Runtime boundaries

```text
Browser
  ├─ Server Components / Server Actions (Next.js)
  ├─ /api/cart + /api/favorites (user-scoped Supabase SSR client)
  └─ /api/checkout (server-only)
          │
          ├─ Supabase service role → current product truth + atomic order RPC
          └─ Stripe secret key → Checkout Session

Stripe
  └─ signed webhook → /api/stripe/webhook
          └─ Supabase service role → payment/order RPC

Supabase
  ├─ Auth (cookie session through @supabase/ssr)
  ├─ PostgreSQL + RLS
  └─ Storage + admin-only writes
```

## Trust model

The browser is untrusted. Product IDs and requested quantities may come from it, but price, discount, stock, total, order status and authorization decisions are recomputed or verified on the server/database.

The Supabase publishable key is safe for public clients only because RLS is the real database authorization boundary. The service-role key bypasses RLS and therefore exists only in server modules that first perform the required checks or are called by trusted webhook flows.

## Checkout sequence

```text
Cart
  → POST /api/checkout
  → validate payload (Zod)
  → load current DB products
  → recompute unit prices
  → RPC create_pending_order
       → SELECT products FOR UPDATE
       → validate stock
       → decrement stock (reservation)
       → create order + order item snapshots
  → Stripe Checkout Session
  → customer pays
  → signed Stripe webhook
  → compare Stripe amount_total to order.total_cents
  → RPC mark_order_paid
```

If Stripe Session creation fails, `release_order_stock` is called immediately. If the session later expires or asynchronous payment fails, the Stripe webhook calls the same idempotent release function.

## Auth

Next.js 16 `src/proxy.ts` refreshes Supabase cookie sessions. Server authorization uses fresh Supabase Auth user validation and then reads the profile role from PostgreSQL. Authenticated routes are dynamic and are never intentionally cached as shared ISR pages.

## Catalog fallback

`src/data/catalog.ts` is a local 20-product catalog so the public UI is inspectable before credentials exist. Once Supabase environment variables are configured and seeded, server catalog functions prefer Supabase. Sensitive flows never fake success when credentials are missing.
