# MINDORA Release — Source Provenance

Prepared: 3 November 2026

## Original client projects

- `Mindora_V3-main (3).zip` — newly supplied MINDORA V3 backend and primary backend source for this update.
- `Mindora_III-frontend-main (4).zip` and `MINDORA_FRONTEND_OPTIMIZED_UNDER_4MB.zip` — original client frontend and an optimized derivative used for comparison/preservation.
- `mindora-website_v2-main.zip` — official website source, kept separate from the web application.
- `Mindora-dashboard_VII-main.zip` — additional client-supplied dashboard project, kept as a separate app under `DASHBOARD_VII/`.
- `mindora-conv-therapy-module-main.zip` — client-supplied FastAPI/Python conversational-therapy service and its React client. The Python backend is included with the backend release; the React client is included under `CHATBOT_WEB_CLIENT/` in the frontend release.
- `MINDORA_HEALTH_PROJECT_PROGRESS_REPORT (2) (1).docx` — latest client-provided progress report reviewed as the reporting baseline. Its extracted substantive text matched the prior copy supplied earlier.

## Previous implementation projects

- `mindora-final-backend.zip` and `mindora-final-frontend.zip` were inspected as intermediate implementation references. Targeted changes were carried forward only where they were consistent with the newer client sources and could be inspected.

## Boundaries and provenance notes

- The supplied conversational therapy module is not independently confirmed to be the exact same version as the public `MindoraVersionTwo` GitHub repository. MINDORA should confirm this identity before production deployment.
- The separately supplied dashboard still uses a legacy `/api/...` route contract. Its API base is configurable, but V3 endpoint compatibility has not been verified in staging.
- The official website, main web app, dashboard and chatbot client remain separately identified applications; they have not been falsely represented as a single tested deployment.
- No production credentials or patient data are intentionally included. Use secret managers for API keys and tokens.
