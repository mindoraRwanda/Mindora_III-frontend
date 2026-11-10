# MINDORA HTML prototype parity

Compared against the supplied `MINDORA_FULL_UPDATE_PROTOTYPE(2)(2).html`.

## Navigation and screen coverage

The production frontend contains the public, patient, therapist, and administrator workspaces represented by the prototype. The shared workspace shell now follows the prototype's responsive left navigation, mobile menu and backdrop, sticky page header, workspace identity, and support contact area.

### Public pages

- **Home:** `/` — current MINDORA marketing homepage and approved assets.
- **Find a therapist:** `/therapists` — live approved therapist directory.
- **About MINDORA:** `/about` — existing informational page.
- **Business:** `/business` — existing organizational services page.
- **Contact:** `/contact` and `/support` — established support workflow and contact details.

### Patient workspace

- **Today:** `/today` — real account, mood, and appointment APIs.
- **Check-in:** `/check-in` — real mood check-in create, read, update, and delete workflow.
- **Therapy:** `/therapy` — therapist search, availability, and booking APIs.
- **Messages:** `/messages` — authenticated messaging workflow.
- **AI reflection:** `/reflect` — connected AI endpoint and crisis handling.
- **Become a therapist:** `/therapist-application` — actual application status and submission workflow.
- **Settings:** `/settings` — existing profile and notification-preference APIs.

### Therapist workspace

- **Dashboard, Schedule, Availability, and Patients:** `/therapist/*` — live appointment-service data.
- **Additional workspaces:** `/therapist/treatment-plans`, `/therapist/medication`, `/therapist/prescriptions`, `/therapist/reports`, `/therapist/communities`, and `/therapist/video-sessions`.
- Some additional clinical sections remain explicitly marked as previews or unavailable until a verified backend API or provider exists.

### Administrator workspace

- **Overview, Therapist applications, Alerts, Users, and Audit:** protected `/admin/*` routes using admin APIs.
- **Appointments:** `/admin/appointments` currently exposes aggregate appointment analytics, not an individual booking register.
- **Notifications:** `/admin/notifications` shows the signed-in administrator's in-app notifications, not a provider email, SMS, or voice delivery log.
- **Release readiness:** `/admin/release-readiness` is an engineering checklist, not a live deployment monitor.

## Deliberate production differences

The supplied HTML labels itself as a prototype and contains illustrative people, appointments, moods, patient records, totals, and notification states. Those demo records and simulated success actions are not production data and have not been copied into the application.

The prototype's role selector is intentionally omitted. Production roles remain determined by the authenticated account and server-side role guards; a patient cannot switch into therapist or admin privileges from a client-side menu.

The extra production routes for screening tests, therapist matching, admin analytics, and moderation remain available. The prototype's navigation order is used for the main public, therapist, and administrator links without removing these existing features.

Visual parity is best-effort rather than pixel-identical. The production app retains its existing API-connected forms, validation, accessibility behavior, design tokens, and branded page content. Screens whose required backend or provider capability is not available continue to say so rather than presenting nonfunctional demo controls as real clinical workflows.
