"use client";

// TEMPORARY — delete this route once the real login/signup pages are wired to
// AuthContext.login(). LoginForm/SignupForm currently only mock submission
// (console.log + redirect), so there is no way to reach any (app) route with
// a real session. This page calls the *real* auth-service directly so the
// rest of the app (RouteGuard, /therapy, etc.) can be exercised against the
// live backend in the meantime.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

export default function DevLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Navigate only once AuthContext has actually committed the new session —
  // pushing right after `await login()` resolves can race ahead of that
  // state update, so /therapy's RouteGuard mounts before isAuthenticated
  // flips true and bounces straight back to /login.
  useEffect(() => {
    if (isAuthenticated) router.push("/therapy");
  }, [isAuthenticated, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "register") {
        await apiFetch("/api/v1/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, role: "PATIENT", userName }),
        });
      }
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the backend.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
        <strong>Temporary dev login.</strong> Calls the real auth-service directly. Delete this
        route once the real login/signup pages call <code>AuthContext.login()</code>.
      </div>

      <div className="mb-5 inline-flex gap-0.5 self-start rounded-lg bg-muted p-1">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-md px-3.5 py-1.5 text-[13px] font-semibold capitalize",
              mode === m ? "bg-white shadow-sm" : "text-muted-foreground"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "register" && (
          <div>
            <label className="mb-1 block text-[12.5px] font-medium">Name</label>
            <Input value={userName} onChange={(e) => setUserName(e.target.value)} required />
          </div>
        )}
        <div>
          <label className="mb-1 block text-[12.5px] font-medium">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-[12.5px] font-medium">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-100 px-3 py-2 text-[12.5px] font-medium text-red-700">
            {error}
          </div>
        )}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting
            ? mode === "register"
              ? "Registering…"
              : "Logging in…"
            : mode === "register"
              ? "Register & log in"
              : "Log in"}
        </Button>
      </form>
    </div>
  );
}
