# SmartShop AI — isolated Classroom Demo Store

Routes:
- /demo-store: browse eight fictional sample products, 4 categories, search, add to demo cart.
- /demo-store/[slug]: translated details and custom locally served SVG concept illustrations.
- /demo-store/cart: local browser cart with quantity and total.
- /demo-store/checkout: simulated confirmation generates ephemeral DEMO reference in browser state only.

**STRICT ISOLATION**
- All demo fixtures live in src/lib/demo/catalog.ts; never insert into public.products, categories, carts, orders, or analytics.
- No Supabase writes, Stripe requests, checkout-session creation, email/phone/address collection, or real payments in these routes.
- Cart stored in localStorage with dedicated smartshop_demo_cart_v1 key, never in production cart. Confirmation clears this key.
- Demo products, stock, prices and order numbers are made-up classroom data and consistently labeled in MN / 中文 / EN.
- 8 original SVG illustrations in public/demo-products (concept illustrations, not actual manufacturer photos).
- Real /shop and /admin/analytics continue to read only actual Supabase data, unaffected.
- Add product / modify price / manage inventory on actual storefront still requires admin rights.

Follow-up: browser testing of category, product detail, cart persistence, checkout, i18n and real-store isolation.
