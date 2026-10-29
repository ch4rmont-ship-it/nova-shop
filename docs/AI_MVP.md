# SmartShop AI — phase 1 AI Product Studio

- Route: /ai-studio; API: POST /api/ai/product-copy.
- Server-only OPENAI_API_KEY required. Optional OPENAI_MODEL (default gpt-4o-mini).
- Admin-only access enforced via Supabase authenticated user and trusted profiles.role; all other users receive 401/403.
- Zod validation, request timeout, bounded output, fail-closed missing key, no fabricated demo AI.
- Human review required before publication. Generated text is editable and copyable; not persisted automatically.
- Deployment: set OPENAI_API_KEY only in Vercel server environment, never NEXT_PUBLIC_ or GitHub.
- Still pending before general availability: persistent user/IP rate limiting, AI usage billing/cost caps, automated tests and production validation. Restrict to admin during pilot.
