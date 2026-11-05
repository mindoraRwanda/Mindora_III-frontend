"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { z } from "zod";
import { forgotPassword } from "@/lib/auth-api";
import { ApiError } from "@/lib/api";
import { MindoraLogo } from "@/components/brand/MindoraLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackLink } from "@/components/public/BackLink";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!z.string().email().safeParse(normalizedEmail).success) {
      setError("Enter a valid email address.");
      return;
    }

    setBusy(true);
    try {
      await forgotPassword(normalizedEmail);
      setSubmitted(true);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "We could not process that request. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-5 py-12">
      <BackLink fallback="/login" className="mb-6" />
      <MindoraLogo />
      <h1 className="mt-8 text-3xl font-bold">Reset your password</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the email address associated with your account. If an account
        exists, MINDORA will request a secure, time-limited reset email.
      </p>

      {submitted ? (
        <div
          role="status"
          className="mt-6 rounded-xl border border-teal-200 bg-teal-50 p-5 text-sm text-teal-900"
        >
          If an account matches this address, a reset message may be sent. This
          page cannot confirm delivery. Check your inbox and spam folder, and
          contact MINDORA support if you need help.
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium" htmlFor="email">
            Email address
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          {error ? (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Submitting…" : "Request reset link"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link href="/login" className="font-semibold text-mindora-purple">
          Sign in
        </Link>
      </p>
    </main>
  );
}
