# NOVA Commerce

Production-oriented ecommerce starter built from scratch with Next.js App Router, TypeScript, Tailwind CSS, Supabase and Stripe. It includes a polished storefront, guest cart, cookie-based auth, customer accounts, order history, verified reviews, admin tools, stock reservation, Stripe Checkout and database-level RLS.

## What is included

- Premium responsive home, shop, category, search and product-detail pages
- Search suggestions, filters, sorting and load-more product listing
- Guest cart with local persistence; authenticated cart merge/sync to Supabase
- Favorites with immediate UI updates and authenticated persistence
- Supabase email/password register, login, email confirmation, forgot/reset password
- Account dashboard, profile, addresses, favorites, order history and order detail timeline
- Stripe hosted Checkout Session created only on the server
- Server-side product price and inventory validation
- Atomic Postgres stock reservation when checkout starts
- Stripe webhook payment confirmation, failed/expired checkout release, and refund stock restoration
- Human-readable order numbers such as `ORD-2026-000001`
- Verified-purchase review policy enforced by Postgres RLS
- Protected admin dashboard, product CRUD, multi-image upload/removal, category CRUD, order fulfilment/refund tools and user list
- Supabase Storage policies for product/category media
- 5 categories and 20 realistic seed products with local fallback artwork
- Sitemap, robots, dynamic product metadata, loading, 404 and error states
- Vercel-ready configuration

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase PostgreSQL / Auth / Storage
- `@supabase/ssr` for cookie sessions
- Stripe Checkout + verified webhooks
- Zod request validation
- Lucide icons

## Project structure

```text
nova-shop/
├─ public/
│  ├─ categories/               # local safe fallback visuals
│  └─ products/
├─ src/
│  ├─ app/
│  │  ├─ api/                   # cart, favorites, checkout, Stripe webhook
│  │  ├─ account/               # protected customer area
│  │  ├─ admin/                 # protected admin console
│  │  ├─ auth/confirm/          # Supabase PKCE callback
│  │  ├─ category/[slug]/
│  │  ├─ product/[slug]/
│  │  ├─ shop/
│  │  └─ ...
│  ├─ components/
│  │  ├─ admin/
│  │  ├─ auth/
│  │  ├─ cart/
│  │  ├─ layout/
│  │  ├─ product/
│  │  └─ ui/
│  ├─ data/catalog.ts           # offline/demo fallback catalog
│  ├─ lib/
│  │  ├─ actions/               # server actions
│  │  ├─ data/
│  │  └─ supabase/              # browser/server/admin/proxy clients
│  ├─ proxy.ts                  # Next.js 16 session refresh proxy
│  └─ types/
├─ supabase/migrations/
│  ├─ 202610190001_initial_schema.sql
│  └─ 202610190002_seed_catalog.sql
├─ .env.example
└─ vercel.json
```

See `docs/ARCHITECTURE.md` for the main trust boundaries and checkout sequence.

## 1. Local installation

Requirements: Node.js 20 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open `http://localhost:3000`.

The public catalog has local fallback data, so the storefront can render before Supabase credentials are added. Authentication, persisted account data, admin operations and real checkout intentionally require real external credentials.

## 2. Supabase setup

Create a Supabase project, then add these values to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_ONLY_SERVICE_ROLE_KEY
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` remains supported as a legacy fallback, but the publishable key is preferred.

### Apply database migrations

Run these files **in order** in the Supabase SQL editor:

1. `supabase/migrations/202610190001_initial_schema.sql`
2. `supabase/migrations/202610190002_seed_catalog.sql`

The first migration creates tables, indexes, triggers, RLS, storage buckets/policies and service-role-only order RPC functions. The second migration seeds 5 categories and 20 products.

If you already use the Supabase CLI, you can instead put this folder under your linked project migration workflow and push the migrations using the CLI version installed on your machine. Review migration output before applying it to production.

### Auth URLs

In Supabase Authentication URL settings set:

- Site URL: your production domain, or `http://localhost:3000` for local development
- Redirect URL: `http://localhost:3000/auth/confirm`
- Production redirect: `https://YOUR_DOMAIN/auth/confirm`

### Create the first admin

Register normally through `/register`, then promote only your trusted user from the Supabase SQL editor:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'YOUR_ADMIN_EMAIL'
);
```

Do not build a public “make me admin” endpoint. Admin server actions perform a fresh database role check before using the server-only service role client.

## 3. Stripe setup

Add Stripe values to `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

The current checkout redirects to Stripe-hosted Checkout, so the publishable key is reserved for future embedded/custom payment UI and does not need to be exposed in checkout logic today.

Create a Stripe webhook endpoint targeting:

```text
https://YOUR_DOMAIN/api/stripe/webhook
```

Subscribe at minimum to:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`
- `charge.refunded`

For local Stripe CLI testing, forward webhooks to:

```text
http://localhost:3000/api/stripe/webhook
```

The webhook signature is verified from the **raw request body** before any order state changes are accepted.

## 4. Checkout / stock behavior

The browser sends only product IDs, quantities and delivery information. It does **not** decide the payable total.

The server then:

1. Reads current products from Supabase using server-only credentials.
2. Recalculates sale/regular prices.
3. Validates active state and stock.
4. Calls the atomic `create_pending_order` Postgres function.
5. That function locks product rows, validates stock, reserves inventory and creates immutable order-item price/name/SKU snapshots.
6. The server creates a Stripe Checkout Session from the server-computed values.
7. A verified Stripe webhook marks the order paid only when the Stripe total equals the order total.
8. Expired/failed checkout releases reserved stock.
9. Admin Stripe refund + refund webhook restore stock idempotently.

This prevents the client from changing price totals or purchasing beyond available stock through normal API manipulation.

## 5. Product images

The schema creates public Supabase Storage buckets:

- `product-images`
- `category-images`

Public users can read media. Only authenticated admins pass the write policies. The admin product form supports multiple file uploads, preview, existing-image removal and primary-image recovery.

## 6. Reviews

A signed-in user can submit/update one review per product. The RLS insert policy verifies that the user has a **paid order** containing that product. The database trigger recalculates average rating and review count after review changes.

## 7. Environment file

Start from `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never commit `.env.local`, service-role keys, Stripe secret keys or webhook secrets.

## 8. Quality checks

After dependencies are installed, run:

```bash
npm run lint
npm run typecheck
npm run build
```

A production deployment should not proceed until all three pass. After the first successful `npm install`, commit the generated `package-lock.json` so dependency resolution stays reproducible.

## 9. Vercel deployment

The simplest workflow is Vercel Git integration:

1. Push this repository to a private GitHub/GitLab/Bitbucket repository.
2. Import the repository in Vercel as a Next.js project.
3. Add all `.env.local` values in Vercel Project Settings → Environment Variables. Never paste server secrets into source files.
4. Deploy a preview first and test auth + checkout using Stripe test mode.
5. Set `NEXT_PUBLIC_SITE_URL` to the final production URL.
6. Update Supabase Site URL / redirect allow-list to the final domain.
7. Add the production Stripe webhook URL and copy its signing secret into Vercel.
8. Redeploy after environment changes.
9. Test one complete order in Stripe test mode before switching Stripe keys to live mode.

With Git integration, feature branches get preview deployments and the production branch can deploy production automatically. For a higher-control release process, stage/test a production deployment before promotion rather than publishing untested builds.

## 10. Production launch checklist

- Replace placeholder support email/footer copy with real business details.
- Upload real licensed product photography through the admin panel.
- Configure the real sender/domain for transactional email if you add custom email delivery.
- Review tax, shipping, refund and privacy/legal requirements for the countries you sell into.
- Test Stripe test cards, failed payments and refund behavior.
- Verify Supabase RLS and storage policies in a staging project before production changes.
- Add observability/error reporting before paid traffic.
- Back up the database and document an incident/refund process.

## Important security notes

- `SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY` are server-only.
- Admin authorization is checked server-side against `profiles.role`; the client never decides admin status.
- Public database tables have RLS enabled.
- Profile role cannot be changed through the normal profile update grant.
- Order totals and stock are calculated/locked server-side.
- Stripe webhook signatures and checkout totals are validated.
- Service-role order functions revoke execution from public/anon/authenticated roles.

