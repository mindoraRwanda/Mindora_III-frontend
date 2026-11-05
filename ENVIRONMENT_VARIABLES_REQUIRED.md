# Frontend environment variables

## Required production build/runtime values

- `NEXT_PUBLIC_API_URL=https://api.mindora.rw` — public Kong API gateway used by the web application.
- `NEXT_PUBLIC_SOCKET_URL=https://api.mindora.rw` — messaging Socket.IO gateway through Kong.
- `NEXT_PUBLIC_SESSION_IDLE_TIMEOUT_MS=1800000` — optional 30-minute idle timeout.

`NEXT_PUBLIC_*` values are embedded into the browser bundle at build time. Set them in Railway before the build. Do not put private API keys, email provider keys, integration secrets or database credentials in `NEXT_PUBLIC_*` variables.
