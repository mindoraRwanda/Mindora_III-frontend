// Pure logic, deliberately split out of proxy.ts - proxy.ts imports
// next/server, which needs Next's request/response runtime globals and
// can't be imported into a plain Jest test file without extra environment
// setup. This module has no such dependency, so it's trivially testable.
export const PUBLIC_PATH_PREFIXES = [
  "/login",
  "/register",
  "/signup",
  "/about",
  "/contact",
  "/tests",
  "/therapists",
  "/get-matched",
  "/oauth/success",
];

export function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
