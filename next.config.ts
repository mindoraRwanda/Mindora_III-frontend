import type { NextConfig } from "next";

// The production deployment answers on both its Vercel alias and the custom
// domain, but the backend only works from the custom domain: Kong's CORS
// allow-list has just https://app.mindora.rw, and the auth refresh cookie is
// SameSite=Lax on .mindora.rw, so it is never sent from a *.vercel.app page.
// On the alias every API call fails CORS and sessions can't survive a reload.
// Send visitors to the canonical host instead. Only this exact host matches,
// so preview deployments (mindora-iii-frontend-git-*.vercel.app) are untouched.
export const VERCEL_PRODUCTION_ALIAS = "mindora-iii-frontend.vercel.app";
export const CANONICAL_ORIGIN = "https://app.mindora.rw";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: VERCEL_PRODUCTION_ALIAS }],
        destination: `${CANONICAL_ORIGIN}/:path*`,
        // Temporary (307) so browsers don't cache it forever if the backend
        // later adds the alias to its CORS allow-list.
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
