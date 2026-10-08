import { isPublicPath } from "./public-paths";

describe("isPublicPath", () => {
  it("treats the landing page and every documented public route as public", () => {
    const publicPaths = [
      "/",
      "/login",
      "/register",
      "/signup",
      "/about",
      "/contact",
      "/business",
      "/support",
      "/welcome",
      "/tests",
      "/tests/some-quiz-id",
      "/tests/some-quiz-id/result",
      "/therapists",
      "/therapists/some-therapist-id",
      "/get-matched",
      "/oauth/success",
    ];
    for (const path of publicPaths) {
      expect(isPublicPath(path)).toBe(true);
    }
  });

  it("treats every protected route as non-public (fail-closed default)", () => {
    const protectedPaths = [
      "/today",
      "/check-in",
      "/therapy",
      "/messages",
      "/reflect",
      "/home",
      "/therapist-application",
      "/therapist-application/new",
      "/admin",
      "/admin/analytics",
      "/admin/users",
      "/admin/therapist-applications/some-id",
      "/therapist",
      "/therapist/dashboard",
      "/therapist/availability",
      "/therapist/patients",
    ];
    for (const path of protectedPaths) {
      expect(isPublicPath(path)).toBe(false);
    }
  });

  it("does not treat a path that merely starts with a public prefix's letters as public", () => {
    // /testsomething should not match the "/tests" prefix rule - only an
    // exact "/tests" or "/tests/..." should.
    expect(isPublicPath("/testsomething")).toBe(false);
    expect(isPublicPath("/loginhelper")).toBe(false);
  });
});
