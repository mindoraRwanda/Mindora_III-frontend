import nextConfig, { CANONICAL_ORIGIN, VERCEL_PRODUCTION_ALIAS } from "../../next.config";

describe("canonical host redirect", () => {
  it("sends the Vercel production alias to app.mindora.rw, keeping the path", async () => {
    const redirects = await nextConfig.redirects!();

    expect(redirects).toEqual([
      {
        source: "/:path*",
        has: [{ type: "host", value: "mindora-iii-frontend.vercel.app" }],
        destination: "https://app.mindora.rw/:path*",
        permanent: false,
      },
    ]);
  });

  it("only matches the exact production alias, never preview deployments", () => {
    expect(VERCEL_PRODUCTION_ALIAS).toBe("mindora-iii-frontend.vercel.app");
    expect(CANONICAL_ORIGIN).toBe("https://app.mindora.rw");
  });
});
