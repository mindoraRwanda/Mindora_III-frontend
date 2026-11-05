"use client";

import { Suspense, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { resetPassword } from "@/lib/auth-api";
import { ApiError } from "@/lib/api";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { BackLink } from "@/components/public/BackLink";

const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(128, "Use no more than 128 characters.")
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d).{8,128}$/,
    "Use at least one letter and one number."
  );

function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const valid = passwordSchema.safeParse(password);
    if (!valid.success) {
      setError(valid.error.issues[0]?.message ?? "Choose a stronger password.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("This reset link is missing its token. Request a new link.");
      return;
    }

    setBusy(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "The reset link may have expired. Request a new one."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-5 py-12">
      <BackLink fallback="/login" className="mb-6" />
      <h1 className="text-3xl font-bold">Choose a new password</h1>

      {!token ? (
        <div role="alert" className="mt-5 rounded-xl bg-red-50 p-5 text-sm text-red-800">
          This reset link is missing its token. {" "}
          <Link href="/forgot-password" className="font-semibold underline">
            Request a new link
          </Link>.
        </div>
      ) : done ? (
        <div
          role="status"
          className="mt-5 rounded-xl border border-teal-200 bg-teal-50 p-5 text-sm text-teal-900"
        >
          Your password has been reset successfully. {" "}
          <Link href="/login" className="font-semibold underline">
            Sign in
          </Link>.
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label htmlFor="new-password" className="block text-sm font-medium">
            New password
          </label>
          <PasswordInput
            id="new-password"
            showStrength
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <label htmlFor="confirm-password" className="block text-sm font-medium">
            Confirm new password
          </label>
          <PasswordInput
            id="confirm-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Use at least 8 characters, including letters and numbers. Reset
            links are single-use and expire after 15 minutes.
          </p>
          {error ? (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Updating…" : "Reset password"}
          </Button>
        </form>
      )}
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-5 py-12">
          <p className="text-sm text-muted-foreground">Loading secure reset form…</p>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
