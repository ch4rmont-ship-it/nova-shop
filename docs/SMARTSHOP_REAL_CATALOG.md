# SmartShop AI — seeded real DB catalogue (preview listings)

24 new SmartShop Select concept listings in six new categories. Old NOVA items were NOT restored.

## Source / assets
- Canonical multilingual seed source: src/data/smartshop-catalog-seed.json.
- Localized product names, short descriptions, descriptions (MN/ZH/EN) saved in products.specifications._i18n JSONB.
- products.specifications._catalog_stage = unverified-preview means preliminary catalogue entry.
- 24 unique, route-generated SVG *illustrative* images: /catalog-images/{slug}.svg. These are NOT supplier photographs.
- Category translations use their six public slugs in src/lib/catalog/catalog-localize.ts.

## Safety and integrity
- Product active true to be visible in /shop, but stock=0 and preorder=false so checkout is disabled.
- No invented inventory, supplier certification, reviews, real orders or confirmed shipping claims.
- Prices are provisional MNT figures for website preview. Marked clearly as indicative, NOT approved retail prices.
- Data is in nova-shop Supabase's actual public.products / public.categories / public.product_images tables; not from the isolated classroom /demo-store.
- Existing authentication, profiles, orders, archived NOVA data and RLS untouched.
- Source code path /catalog-images/[slug] is required for these images to load; promote verified smartshop-ai code to production before considering public availability.
- Before actual trading, admin must verify sourcing, real item photos, price, availability, consumer policies, delivery and support; then remove preview flag and set stock.

## Language coverage
- Global MN/中文/English switcher cookie.
- Localized storefront catalog and category labels, product cards, product detail and cart / product actions.
- Other legacy commerce forms and some account/admin screens remain partially Mongolian; they are not advertised as 100% translated.
- Demo Store remains a separate, fictional no-payment flow.
