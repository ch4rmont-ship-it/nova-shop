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

## Local installation

Requirements: Node.js 20 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open `http://localhost:3000`.

See the full README in this repository for Supabase, Stripe and Vercel setup.
