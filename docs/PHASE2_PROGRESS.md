# SmartShop AI — API-key-later build

This branch keeps existing NOVA checkout and customer data intact. No database reset or schema changes.

## Added
- /admin/analytics: admin-only real Supabase payment-aware revenue and item counts; last 1000 orders explicitly scoped.
- /admin/marketing: editable rule-template draft; clearly labeled demo, not AI.
- /pricing: proposed Free, Pro and Enterprise subscription pricing; not a functioning checkout.
- /demo: Chinese-language 9-part university presentation outline.
- Admin sidebar links for new tools.

## Next
- Customer-facing AI support with database-aware responses and clear unconfigured state.
- Product selection, localization, redesign, and production hardening.
- Connect OPENAI_API_KEY only after all key-independent features are ready.
- Confirm preview deployment build and verify real browser behavior before production promotion.
