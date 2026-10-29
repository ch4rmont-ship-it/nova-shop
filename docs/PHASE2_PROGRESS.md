# SmartShop AI — API key deferred

Active development branch: smartshop-ai. Existing commerce DB schema / RLS / authentication preserved.

## Implemented
- Brand / responsive homepage and admin dashboard.
- Product Studio AI endpoint — real generation requires OPENAI_API_KEY.
- Rule-based catalog Customer Service, real-vs-demo Product Selection.
- Three-language UI infrastructure, cookie setting and language switcher.
- Multilingual storefront landing, catalog search/filter, global navigation, admin shell, marketing, analytics, finance, pricing, product studio, support initial locale.
- Marketing rule template generator with local browser drafts.
- Real paid-order analytics and profitability scenario calculator.
- All demo figures explicitly labeled and never silently mixed with real business data.

## Pending
- Finish translating old commerce and admin forms.
- Centralize translation for every remaining route and system error; browser end-to-end testing of locale persistence and phone layouts.
- AI provider integration only after security, usage limits and API key are ready.
- Customer support verified policies, live inventory and official supplier validation.
- Persistent marketing campaigns (optional) and aggregate SQL for very large order volumes.
- Production promotion remains gated on QA and user release decision.
