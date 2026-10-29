# SmartShop AI Product Generator

The AI Studio at /ai-studio calls POST /api/ai/product. Access is restricted to signed-in admins using the existing profiles role check.

## Setup

Set OPENAI_API_KEY in Vercel server-side environment variables or local .env.local. Optionally set OPENAI_MODEL (default gpt-4.1-mini). Never expose API keys in NEXT_PUBLIC_ variables or commit real keys.

The API returns 503 AI_NOT_CONFIGURED if no key is present; it never pretends template output is AI. It performs input validation, authenticates admins, limits requests to five per minute per user per warm server instance, enforces a 20-second timeout, and returns errors for provider failures.

## Limitations

Rate limiting is in-memory and only suitable as an MVP safeguard. Replace it with persistent distributed rate limiting and add usage budgets before public production rollout. Generated content is editable/copyable but is not yet saved to products or the database. This implementation does not include chatbot, analytics, marketing, or product selection services.

## Verification

Run npm ci, npm run lint, npm run typecheck, npm run build. Test unauthenticated 401, customer 403, admin 503 without key, admin success with key, input validation 400, and 429 limit. No external provider request occurs when the key is unset.
