# SmartShop AI legacy NOVA commerce reset

Supabase project: nova-shop (gskzwsbootemeibfhltp) only.
Database migration: archive_legacy_nova_commerce_and_clear_catalog.

Legacy business rows archived as JSONB in private.smartshop_legacy_backup (53 rows).
Cleared public: addresses, cart_items, categories, favorites, order_items, orders, product_images, product_sourcing, products, reviews.
Preserved: profiles (4), auth.users (4), tables/RLS, Supabase project and other projects.
Storage objects and repository source images are not deleted; they may still be referenced by backup and require separate cleanup review.
Do not re-run destructive reset as it would erase future SmartShop data.
