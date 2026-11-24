"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Mail } from "lucide-react";
import { MindoraLogo } from "@/components/brand/MindoraLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/lib/auth-api";
import { ApiError } from "@/lib/api";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    setApiError(null);
    try {
      await forgotPassword(data.email);
      setSubmitted(true);
    } catch (err) {
      setApiError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <MindoraLogo />

        {submitted ? (
          <div className="mt-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mindora-purple-pale">
              <Mail className="h-7 w-7 text-mindora-purple" />
            </div>
            <h1 className="mt-6 text-center text-2xl font-bold text-foreground">
              Check your email
            </h1>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              If an account exists with that email, we&apos;ve sent a password reset link. It
              expires in 15 minutes.
            </p>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="font-semibold text-mindora-purple hover:underline"
              >
                try again
              </button>
            </p>
            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-mindora-purple hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <>
            <h1 className="mt-8 text-2xl font-bold text-foreground">Forgot your password?</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the email address you signed up with and we&apos;ll send you a link to reset
              your password.
            </p>

            {apiError && (
              <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="mt-1"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send reset link"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-mindora-purple hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
