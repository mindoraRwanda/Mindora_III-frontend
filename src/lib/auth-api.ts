import { apiFetch } from "@/lib/api";
import type { AuthTokenResponse, RegisterRequest } from "@/types/domain";

// POST /api/v1/auth/login
export function login(email: string, password: string): Promise<AuthTokenResponse> {
  return apiFetch("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// POST /api/v1/auth/refresh - HttpOnly refresh cookie is sent automatically via
// apiFetch's credentials: 'include', not passed explicitly here.
export function refreshSession(): Promise<AuthTokenResponse> {
  return apiFetch("/api/v1/auth/refresh", { method: "POST" });
}

// POST /api/v1/auth/register - only returns { userId }, no tokens - callers follow
// up with a real login to establish the session.
export function register(params: RegisterRequest): Promise<{ userId: string }> {
  return apiFetch("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

// POST /api/v1/auth/logout
export function logout(): Promise<void> {
  return apiFetch("/api/v1/auth/logout", { method: "POST" });
}

// POST /api/v1/auth/forgot-password - always 200 with the same message whether
// or not the email exists (no account enumeration), so callers must not imply
// that an account was found.
export function requestPasswordReset(email: string): Promise<{ message: string }> {
  return apiFetch("/api/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// POST /api/v1/auth/reset-password - token comes from the emailed
// /reset-password?token= link. 400 "Invalid or expired reset token" once used
// or expired.
export function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  return apiFetch("/api/v1/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}
