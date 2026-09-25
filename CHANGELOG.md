# Changelog

Notable frontend changes, newest first. Working log, not a public release
changelog — entries describe what changed and why.

## 2026-09-25

### Fixed — the Schedule page (`/therapist`, the default post-login landing for every therapist) has been silently broken this whole time

`useTherapistSchedule` (`hooks/useAppointments.ts`) called
`fetchTherapistSchedule({ date, limit: 100 })`, but appointment-service's
`therapistScheduleQuerySchema` caps `limit` at 50 and 400s above that —
found live while browser-testing the new therapist dashboard/availability/
patients pages below: every navigation back to `/therapist` threw a
`Validation failed` console error and the page never rendered any
appointments. Pre-existing, not introduced by this session's other changes
— confirmed by testing before and after fixing it. Fixed by requesting
`limit: 50`; live-verified the Schedule page now actually shows appointments.

### Added — therapist workspace: dashboard, availability, patients pages

Three new pages under `/therapist/`: `dashboard` (today's sessions, pending/
upcoming/patient-count stat cards), `availability` (weekly working-hours
grid + time-off list, backed by appointment-service's new
`TherapistSchedule`/`TherapistWorkingHours`/`TherapistTimeOff` API), and
`patients` (paginated list of patients the therapist has an actual
appointment relationship with — never a raw platform-wide list). New
`lib/availability.ts` helper module for the working-hours grid's flat-list
↔ per-day-state conversion. Sidebar (`TherapistSidebar.tsx`) gains three
nav entries; existing `Schedule` entry and `/therapist/page.tsx` untouched.
Live-verified end-to-end in a real browser against a running backend:
configured a real weekly schedule (toggled a day on, saved, confirmed it
persisted on reload and via a direct API check), confirmed the patient list
correctly resolves a real patient's name, confirmed dashboard counts.

### Added — admin Analytics page: real charts over admin-service's new `GET /analytics/detailed`

New `/admin/analytics`, separate from the existing Overview page (which
keeps its flat stat cards, untouched) — a date-range picker (Today/7d/30d/
90d/This year/Custom) driving three sections (users, therapist
applications, appointments/sessions), each with stat tiles plus recharts
line/bar charts. First real use of `recharts` in this repo (installed but
zero-imported before this). Followed the `dataviz` skill for form/color/
interaction decisions — notably: single-series charts use one hue, not a
rainbow per category (that's a magnitude comparison, not an identity one);
the only multi-series chart (session trend, 4 simultaneous status lines)
uses the categorical palette; no donut/pie anywhere, per the skill's form
guidance; legend text stays neutral-colored rather than tinted per-series.
New `lib/analytics-date-range.ts` (pure, tested: preset boundary math +
sparse-trend zero-filling for gap-free lines). Live-verified against real
seeded data: default 30-day range correctly excluded a since-future-dated
test appointment; widening to a custom range covering it made it appear
correctly in both the status-breakdown bar and the session-trend line.

## 2026-08-24

### Fixed — Dev-mode navigation took a couple of seconds on every route switch

`package.json`. Measured directly rather than guessed: hitting every sidebar
route twice each showed 0.27–1.6s per request, with **second visits sometimes
slower than the first** — ruling out simple first-visit compile cost and
pointing at steady-state per-request overhead in `next dev`'s dev pipeline.
Client-side navigation itself was already correct (sidebar links use
`next/link`; auth bootstrap runs once at the root layout, not per navigation —
both checked before landing on this).

The `dev` script had never opted into Turbopack, so it was running on
webpack — the slower of Next's two dev compilers. Next 16.2.9 supports
Turbopack for dev as a stable option with nothing in `next.config.ts` that
conflicts with it.

```diff
-    "dev": "next dev",
+    "dev": "next dev --turbopack",
```

Re-measured the same routes after switching: 0.16–0.61s, consistently, no
more 1s+ outliers — roughly 2–4x faster and far more even. This is dev-mode
overhead specifically; a production build (`next build && next start`) has no
equivalent cost.

### Fixed — `Date.now()` called during render in `today/page.tsx`

`src/app/(app)/today/page.tsx`. The `nextSession` memo called `Date.now()`
directly inside its callback to filter out past appointments — an ESLint
`react-hooks/purity` **error** (`Cannot call impure function during render`),
not just a style nit: React's render function can run more than once per
commit (Strict Mode, the compiler), so an impure read taken during render can
disagree with itself between invocations.

There was a real bug riding along with the lint violation: the memo's
dependency array was `[appointmentData]` only, not time, so a session that
quietly passed into the past kept showing as "next" until the appointments
list happened to refetch for an unrelated reason.

```diff
+  const [now] = useState(() => Date.now());
+
   const nextSession = useMemo(() => {
-    const now = Date.now();
     return (
       (appointmentData?.appointments ?? [])
-        .filter((a) => a.status === "PENDING" || a.status === "CONFIRMED")
+        .filter(
+          (a) =>
+            (a.status === "PENDING" || a.status === "CONFIRMED") &&
+            new Date(a.slotStart).getTime() > now
+        )
         .sort(...)[0] ?? null
     );
-  }, [appointmentData]);
+  }, [appointmentData, now]);
```

`now` is taken once via a `useState` lazy initializer (React's sanctioned
escape hatch for a one-time impure read) rather than called fresh each render,
and is now a real memo dependency. Verified against the installed linter
directly, not from memory: `npx eslint` on the file went from 1 error to 0;
full-project `npm run lint` and `npm run type-check` both clean afterward (4
pre-existing warnings remain — react-hook-form/React Compiler notices and
`<img>` vs `next/image` suggestions — informational, not errors).
