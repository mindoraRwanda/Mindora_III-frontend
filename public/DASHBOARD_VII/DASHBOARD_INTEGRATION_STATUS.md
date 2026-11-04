# Dashboard VII — integration status

This dashboard was supplied as `Mindora-dashboard_VII-main.zip` and is retained as a separate Vite/React admin and therapist dashboard project. Its original source referenced the legacy `mindora-backend-beta-version-m0bk.onrender.com/api/...` REST API. Those base URLs were moved to `VITE_API_BASE_URL` so the host is configurable.

**Important:** the endpoint paths remain the legacy REST API contract. They have not been mapped or end-to-end verified against the current MINDORA V3 microservices. Do not point this dashboard at production V3 until an API-by-API compatibility mapping and authorized staging tests are completed.

Set `VITE_API_BASE_URL` in the dashboard environment before running it.
