# MINDORA frontend — delivery notes

**Prepared:** 1 November 2026

## Included work

- Updated primary frontend design tokens to a calm white/teal MINDORA palette and aligned the existing light surfaces with it.
- Therapist discovery, the matching flow, and therapist profile pages read the public, approved, accepting-therapist API; the previous mock therapist cards are no longer used for live patient-facing recommendations.
- Therapist profiles resolve from live directory data.
- Booking page resolves the therapist from the live API and opens the existing availability/booking dialog.
- Corrected the frontend appointment `SessionType` values to match the backend enum: `VIDEO`, `IN_PERSON`, `CHAT`. The prior frontend `AUDIO` value was not accepted by the backend booking schema.
- Added patient registration password confirmation, the minimum password policy and a strength indicator.
- Added forgot-password and reset-password pages that use the backend's single-use reset-token endpoints.
- Added separate therapist login/signup routes. Therapist signup creates a regular patient account first and routes the applicant into the protected application workflow; it cannot self-assign a therapist role.
- Added 30-minute default inactivity logout (configurable through `NEXT_PUBLIC_SESSION_IDLE_TIMEOUT_MS`).
- Therapist application upload options show CV, practising licence and diploma.
- Business-page navigation is same-tab internal navigation; no `_blank` is used on the `/business` page route.
- The official website Contact page phone and email cards are clickable (`tel:+250783974066` and `mailto:info@mindora.rw`); the published hours/response-time text is retained.
- The supplied `mindora-website_v2` marketing website is included separately at the package root in `OFFICIAL_WEBSITE/`; it remains a separate application. Its Contact page phone and email cards were updated to use `tel:` and `mailto:` links.

## Run locally

Use Node.js 24.16.0 to match the backend monorepo runtime used for this delivery.

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` to the environment's API gateway URL. The default example points at the public MINDORA API. Do not put server-only credentials into any `NEXT_PUBLIC_` variable.

## Remaining operational prerequisites

- Ensure the API gateway CORS allowlist includes the deployed frontend origin.
- Configure a trusted parent cookie domain when frontend and API are on different subdomains (`COOKIE_DOMAIN` on backend).
- Populate backend therapist records with real, approved profiles and active availability; empty approved data will correctly show an empty directory.
- Configure backend email/SMS provider keys and MINDORA operations recipients before testing live notification delivery.

## Verification and limitations

- TypeScript/TSX syntax parser: 394 files across supplied frontend/backend, no syntax diagnostics at the time of packaging.
- Full Next build, TypeScript semantic check, Jest suite and real browser end-to-end tests were not completed because dependency installation did not complete in the provided environment. Run `npm ci`, `npm run type-check`, `npm test` and `npm run build` in CI with Node.js 24.16.0 before deployment.
- The supplied marketing website is included as source, not merged into the app's runtime or deployed.
- The user asked for a frontend inspired by Shezlong. This delivery adopts a mental-health marketplace flow, live therapist search/profile/booking, responsive UI and a teal/white MINDORA identity; it is not a pixel-perfect copy of Shezlong's proprietary page designs, brand assets or content.
