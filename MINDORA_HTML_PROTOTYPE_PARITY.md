# MINDORA HTML prototype parity

Compared against the supplied `MINDORA_FULL_UPDATE_PROTOTYPE(2)(2).html`.

## Navigation and screen coverage

The production frontend contains the public, patient, therapist, and administrator workspaces represented by the prototype. This update aligns the shared workspace shell with the prototype's responsive left navigation, mobile menu/backdrop, sticky page header, shared workspace identity, and support contact area.

| Prototype area | Production route or implementation | Parity notes |
| --- | --- | --- |
| Public home | `/` | Uses the current MINDORA marketing homepage and approved assets |
| Find a therapist | `/therapists` | Live approved therapist directory |
| About MINDORA | `/about` | Existing informational page |
| Business | `/business` | Existing organizational services page |
| Contact | `/contact` → `/support` | Uses the established support workflow and contact details |
| Patient Today | `/today` | Real account, mood and appointment APIs |
| Patient Check-in | `/check-in` | Real mood check-in CRUD |
| Patient Therapy | `/therapy` | Therapist search, availability and booking APIs |
| Patient Messages | `/messages` | Authenticated messaging workflow |
| Patient AI reflection | `/reflect` | Connected AI endpoint and crisis handling |
| Become a therapist | `/therapist-application` | Actual application status and submission workflow |
| Patient Settings | `/settings` | Existing profile and notification-preference APIs |
| Therapist Dashboard / Schedule / Availability / Patients | `/therapist/*` | Live appointment-service data |
| Therapist additional workspaces | `/therapist/treatment-plans`, `medication`, `prescriptions`, `reports`, `communities`, `video-sessions` | Some sections remain explicitly marked as previews or unavailable until a verified backend API/provider exists |
| Admin Overview / Applications / Alerts / Users / Audit | `/admin/*` | Uses protected admin APIs |
| Admin Appointments | `/admin/appointments` | Current API exposes aggregate appointment analytics, not an individual booking register |
| Admin Notifications | `/admin/notifications` | Shows the signed-in administrator's in-app notifications; not a provider email/SMS/voice delivery log |
| Admin Release readiness | `/admin/release-readiness` | Engineering checklist, not a live deployment monitor |

## Deliberate production differences

The supplied HTML labels itself as a prototype and contains illustrative people, appointments, moods, patient records, totals, and notification states. Those demo records and simulated success actions are not production data and have not been copied into the application.

The prototype's role selector is intentionally omitted. Production roles remain determined by the authenticated account and server-side role guards; a patient cannot switch into therapist or admin privileges from a client-side menu.

The extra production routes for screening tests, therapist matching, admin analytics, and moderation remain available. The prototype's navigation order is used for the main public, therapist, and administrator links without removing these existing features.

Visual parity is best-effort rather than pixel-identical: the production app retains its existing API-connected forms, validation, accessibility behavior, design tokens, and branded page content. Screens whose required backend/provider capability is not available continue to say so rather than presenting nonfunctional demo controls as real clinical workflows.
