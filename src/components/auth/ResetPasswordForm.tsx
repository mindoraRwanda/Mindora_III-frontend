"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { MindoraLogo } from "@/components/brand/MindoraLogo";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/lib/auth-api";
import { ApiError } from "@/lib/api";

const schema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md text-center">
          <MindoraLogo />
          <h1 className="mt-8 text-2xl font-bold text-foreground">Invalid reset link</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <div className="mt-6">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-mindora-purple hover:underline"
            >
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: FormValues) => {
    setApiError(null);
    try {
      await resetPassword(token, data.newPassword);
      setSuccess(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setApiError("This reset link has expired or already been used. Please request a new one.");
      } else {
        setApiError(
          err instanceof ApiError ? err.message : "Something went wrong. Please try again."
        );
      }
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md text-center">
          <MindoraLogo />
          <div className="mt-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-foreground">Password updated</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <Button className="mt-8 w-full" onClick={() => router.push("/login")}>
              Sign in
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <MindoraLogo />
        <h1 className="mt-8 text-2xl font-bold text-foreground">Set a new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a new password for your account. It must be at least 8 characters.
        </p>

        {apiError && (
          <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label htmlFor="newPassword" className="text-sm font-medium">
              New password
            </label>
            <PasswordInput
              id="newPassword"
              autoComplete="new-password"
              className="mt-1"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm password
            </label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              className="mt-1"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset password"}
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
      </div>
    </div>
  );
}
