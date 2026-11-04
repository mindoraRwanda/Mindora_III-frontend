# MINDORA Final Frontend Source Package

This release preserves four separately identified client-facing source projects:

- `MINDORA_WEB_APP/` — the existing Next.js MINDORA web application.
- `OFFICIAL_WEBSITE/` — the separately maintained official marketing website.
- `DASHBOARD_VII/` — the supplied Vite/React dashboard; its legacy API routes still need V3 staging mapping.
- `CHATBOT_WEB_CLIENT/` — the React client supplied with the Python conversational-therapy module.

Read each project's README and `.env.example` before running it. The dashboard, official website, main web app and chatbot client are separate applications and have not been represented as one tested deployment. Use the declared Node runtime for each app. The V3 backend requires Node.js >=24.16.0. Full frontend installs, builds and browser E2E tests remain required in staging.

The Shezlong website is a design reference only. No pixel-perfect screenshot match is claimed.
