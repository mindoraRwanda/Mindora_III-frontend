# Changelog

Notable frontend changes, newest first. Working log, not a public release
changelog — entries describe what changed and why.

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
