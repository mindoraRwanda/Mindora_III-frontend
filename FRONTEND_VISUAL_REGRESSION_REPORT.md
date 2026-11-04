# Frontend Visual Regression Report

Status: NOT FULLY VERIFIED.

The source package includes the previous Shezlong-inspired MINDORA UI implementation. Static TypeScript/TSX syntax parsing passed with zero syntax diagnostics. However, browser automation, responsive screenshot capture and side-by-side comparison against the live Shezlong reference were not completed because dependencies/browser test tooling were not installed in the execution environment.

Before production, run the frontend on the declared Node.js runtime (24.16.0), execute the project test/build scripts, and capture comparable screenshots at desktop, tablet and mobile viewports for the routes listed in `FRONTEND_PAGE_MAPPING.md`.


## Updated contact interaction check — 1 November 2026

- The official website Contact page now renders the public phone card as `tel:+250783974066` and the email card as `mailto:info@mindora.rw`.
- This source-level check does not replace a browser click test on desktop and mobile.
- The existing official marketing copy contains separate statements about 24/7 platform/crisis support. MINDORA clinical leadership should confirm the accuracy and destination of any separate crisis hotline claim before go-live; the general public contact number is published only with weekday business hours.
