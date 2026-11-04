# MINDORA Frontend — Final Source Release Status

Prepared: 1 November 2026

This archive is based on the previous MINDORA frontend implementation and retains the original client app architecture. It includes the official `mindora-website_v2` marketing website source in a separate root-level `OFFICIAL_WEBSITE/` directory. The official marketing website remains a separately deployable project; it has not been merged into the app's runtime. Its public Contact page cards were updated to make the supplied phone and email actionable.

## Included frontend work retained

- Existing Next.js App Router application and MINDORA routes retained.
- Existing previous Shezlong-inspired design attempt retained for further visual refinement.
- Existing white/teal MINDORA visual tokens retained.
- Therapist directory and profile pages use approved live therapist API data rather than hardcoded live recommendation data.
- Booking flow uses the existing availability/booking API integration.
- Session type values aligned to backend values: `VIDEO`, `IN_PERSON`, `CHAT`.
- Signup password confirmation, password policy and strength indicator.
- Forgot-password and reset-password pages.
- Separate therapist login/signup routes and protected therapist application flow.
- Default 30-minute inactivity logout, configurable through `NEXT_PUBLIC_SESSION_IDLE_TIMEOUT_MS`.
- Therapist CV, practising licence and diploma upload options.
- Business-page internal navigation uses the same tab.
- Approved MINDORA public website source preserved separately under `OFFICIAL_WEBSITE/`.

## Asset optimization

The optimized original frontend archive was compared and its WebP assets were copied into the frontend package where corresponding references were updated. The original high-size doctor image assets were replaced in the app tree by WebP equivalents. Other source files, app routes and official-website assets were retained.

## Shezlong visual verification status

The existing Shezlong-inspired implementation is included, but a screenshot-by-screenshot browser comparison against the live Shezlong website was not completed in this environment. The previous implementation notes explicitly state that it is a reference-inspired MINDORA design, not a pixel-perfect reproduction. Do not represent this archive as a fully visually certified Shezlong match.

## Public contact information

The public contact details supplied by MINDORA are displayed as general support contacts: `+250 783 974-066` (Monday to Friday, 9am–5pm) and `info@mindora.rw` (expected response within 24 hours). The app and official website contact cards use `tel:` and `mailto:` links. These public contacts are not represented as a 24/7 crisis service. Existing separate marketing copy referring to a 24/7 crisis hotline should be verified by MINDORA clinical leadership; the public contact number above is not presented as that hotline.

## Operational prerequisites

- Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` for the target environment.
- Ensure the API gateway CORS allowlist includes the deployed frontend origin.
- Configure the trusted parent cookie domain where frontend and API use different subdomains.
- Ensure backend therapist records contain approved profiles and active availability.
- Configure backend email/SMS providers and internal recipient lists before live notification testing.

## Verification performed

- TypeScript/TSX syntax transpilation: 396 files scanned across prepared frontend and backend; 0 syntax diagnostics.
- Frontend package manifest and lockfile retained.
- Original marketing website source is included separately.
- JSON parse: 57 files with 0 errors; YAML parse: 15 files with 0 errors. The actual `preFilter.ts` manual phrase harness passed 22/22 cases. Archive integrity is checked after packaging.

## Verification not completed

- Full `npm ci` / dependency installation.
- Next.js production build.
- ESLint and semantic TypeScript type-check.
- Jest suite.
- Browser-based E2E tests and responsive screenshot regression.
- Full live API booking and authentication flow validation.

The frontend declares Node.js `24.16.0` in `.nvmrc`. The current execution environment used Node.js `22.16.0`; dependency installation did not complete. Run CI/staging checks using the declared Node runtime before deploying.
