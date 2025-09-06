## Summary
Integrate GLM-4.5 (Z.AI) as the coding LLM for the Inngest agent with a user-facing Settings page to store API keys in DB, wire the E2B Sandbox key, and prepare the project for Vercel deployment.

## Why
- Allow end users to manage their own GLM-4.5 and E2B keys in-app instead of relying on server env-only.
- Switch the agent to a reasoning-focused, streaming-ready model via OpenAI-compatible endpoint.
- Improve deployability on Vercel (Prisma client generation + function runtime limits).

## Changes
- Inngest agent now uses GLM-4.5 via OpenAI-compatible API
  - Uses DB-stored keys to set OPENAI_API_KEY and OPENAI_BASE_URL at runtime.
  - Sets E2B_API_KEY from DB before creating/connecting sandbox.
- Prisma: new AppSettings model (+ migrations) for zaiApiKey, e2bApiKey
- tRPC: settings router (get, setKeys) and wiring in _app router
- UI: /settings page with form to paste Z.AI + E2B keys
- Vercel prep: postinstall prisma generate, prisma:deploy script, vercel.json function limits, .env.example
- UX: fix MessageForm to submit via onSubmit

## Env/Config
- Required: DATABASE_URL, NEXT_PUBLIC_APP_URL
- Optional fallbacks: ZAI_API_KEY, E2B_API_KEY (if not set via Settings page)

## Deployment
- Run `prisma migrate deploy` on first deploy
- Configure envs in Vercel; /settings can be used to store keys post-deploy

## Impact
- Enables GLM-4.5 reasoning/code generation path
- User-manageable keys; fewer redeploys for credential updates
- Smoother Vercel deploys and more reliable long-running functions