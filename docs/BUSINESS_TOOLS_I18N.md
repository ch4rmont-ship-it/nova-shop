# SmartShop AI — i18n and Business Tools (2026-10-29)

Branch: smartshop-ai. No production deployment or real AI key change.

## MN / 中文 / EN

- Shared translation dictionary in src/lib/i18n.ts with typed keys.
- Locale persisted in server-set, httpOnly, sameSite=Lax cookie smartshop_locale via POST /api/locale.
- Language selector in global header. Full reload after setting cookie so Next Server Components render correct server-side locale and <html lang> changes.
- Localized: header, footer, primary admin sidebar, homepage, shop listing and filters, pricing, customer support initial language, AI content studio, marketing workspace, analytics dashboard and finance calculator.
- Dashboard summary metric labels and most section headings are localized.
- Not yet fully translated: several existing commerce forms / product detail / checkout / authentication / profile / remaining admin CRUD pages. Translation should be completed in future i18n rounds; do not claim whole app is fully localized.
- No external translation service or API key used.

## Marketing Studio: /admin/marketing
- Four campaign channels: Facebook, Instagram, 小红书, 微信.
- Three rule templates per language, editable content and user-supplied factual features.
- Browser-local save/load/delete up to 15 drafts, not saved to Supabase.
- Marked TEMPLATE DEMO / 非AI生成. No automatic publishing or AI call.

## Sales Analytics: /admin/analytics
- Uses authenticated user and admin role from existing /admin layout.
- Real Supabase paid order values only, recent 1000 orders limit.
- Six calendar months (with zero months represented), order status, paid-order percentage, AOV, top order item quantities.
- Revenue does NOT equal profit; fees, refunds and taxes are not subtracted. Not a historical unlimited report.

## Financial Calculator: /admin/finance
- Fully client-side, no new tables and no keys. MNT scenario model, editable inputs and explicit fictional example.
- Revenue = selling price * forecast units.
- Variable unit cost = purchase cost + delivery/unit + packaging/unit + sale price * (payment fee % + marketing %)/100.
- Contribution / unit = selling price - variable unit cost.
- Total cost = variable unit cost * units + monthly fixed expenses.
- Projected net result = revenue - total cost.
- Product gross margin = (selling price - purchase cost)/selling price.
- Break-even units = ceil(monthly fixed expenses / contribution per unit), when contribution positive; otherwise unavailable.
- ROI approximation = forecast net result / total cost.
- No claims of tax compliance, true business profitability or live sales.

## QA / Release
- Next build and TypeScript checks run on Vercel previews.
- Browser interaction testing, cookie behavior, financial boundary test suite, persistent marketing draft storage and all-forms translation remain outstanding.
- API key will be connected last, as requested.
- Keep all changes on smartshop-ai preview until user explicitly approves production promotion.
