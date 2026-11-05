# MINDORA frontend — final source handover

## Primary production application

The root of this archive is the Next.js application that Railway should build for the patient/therapist/admin web app. The `MINDORA_WEB_APP` source previously nested below the repository has been promoted to the repository root so that routes such as `/forgot-password` and `/reset-password` are part of the actual root build, not hidden inside a nested copy.

## Password reset UI

- `/forgot-password` posts to `POST /api/v1/auth/forgot-password` through `NEXT_PUBLIC_API_URL`.
- `/reset-password?token=...` posts to `POST /api/v1/auth/reset-password`.
- The reset page is wrapped in `Suspense` for Next.js static rendering compatibility.
- The UI avoids claiming email delivery because the API cannot confirm final mailbox delivery in the synchronous response.

## API and Railway configuration

- Set `NEXT_PUBLIC_API_URL=https://api.mindora.rw` at build time. This is the MINDORA Kong API gateway, not the documentation host.
- Set `NEXT_PUBLIC_SOCKET_URL=https://api.mindora.rw`.
- The supplied Railway frontend target port is 8080; the Dockerfile exposes/listens on port 8080 by default, and Railway should keep its service port consistent.
- The API must allow credentials from `https://app.mindora.rw` and set the refresh cookie domain to `.mindora.rw` where the existing auth architecture requires the shared parent-domain cookie.

## Companion applications

The `companion_apps/` directory preserves separate legacy projects and assets, but they are not imported by the root Next.js application or included in its TypeScript, Jest, ESLint, Prettier, or Docker context.

- `companion_apps/legacy-chatbot-web-client` is an older Create React App client. The main MINDORA chatbot experience in the root application uses the V3 AI API. The legacy client is kept for reference and must not be treated as production-integrated without a separate test.
- `companion_apps/dashboard-vii-legacy` still uses an older REST API contract. Its own integration note explains that it has not been mapped against MINDORA V3. Do not connect it to production V3 until API-by-API compatibility is tested.
- `companion_apps/official-website` is preserved separately. The root Next.js project already includes public routes. Do not move domains or replace the live website without approval.

## Verification and limitations

The source structure and configuration were statically inspected. Full `npm ci`, TypeScript, ESLint, Jest, Next build, and Railway/DNS checks require Node 24.16.0 and access to the npm registry and must be run in CI or an authorized staging environment. This handover does not claim those remote checks passed.

## Final local checks

Run `RUN_MINDORA_FRONTEND_CHECKS.cmd` on Node.js 24.16.0 with npm registry access. It performs install, formatting, TypeScript, ESLint, Jest coverage and Next production build. This archive has not been certified by those full checks in the packaging environment.
