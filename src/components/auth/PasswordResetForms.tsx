"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { MindoraLogo } from "@/components/brand/MindoraLogo";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { BackLink } from "@/components/public/BackLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api";
import { requestPasswordReset, resetPassword } from "@/lib/auth-api";

function errorText(err: unknown) {
  return err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
}

function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col p-8 lg:p-14">
      <BackLink fallback="/login" className="mb-6" />
      <MindoraLogo />
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

const forgotSchema = z.object({ email: z.string().email("Please enter a valid email") });

export function ForgotPasswordForm() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }: z.infer<typeof forgotSchema>) => {
    setApiError(null);
    try {
      // The server answers identically whether or not the account exists -
      // show its message as-is rather than claiming an email was sent.
      const { message } = await requestPasswordReset(email);
      setSentMessage(message);
    } catch (err) {
      setApiError(errorText(err));
    }
  };

  return (
    <Shell
      title="Reset your password"
      subtitle="Enter your account email and we'll send you a link to choose a new password."
    >
      {sentMessage ? (
        <p role="status" className="mt-8 rounded-xl bg-mindora-purple-pale p-4 text-sm">
          {sentMessage}
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          {apiError && <p className="text-xs text-red-500">{apiError}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send reset link"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      )}
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-mindora-purple hover:underline">
          Sign in
        </Link>
      </p>
    </Shell>
  );
}

// Mirrors auth-service's resetPasswordSchema (8-128 characters).
const resetSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  if (!token) {
    return (
      <Shell title="Reset link incomplete" subtitle="This link is missing its reset token.">
        <Button asChild className="mt-8 w-fit">
          <Link href="/forgot-password">Request a new link</Link>
        </Button>
      </Shell>
    );
  }

  const onSubmit = async ({ newPassword }: z.infer<typeof resetSchema>) => {
    setApiError(null);
    try {
      await resetPassword(token, newPassword);
      // replace, not push: keep the single-use token out of browser history.
      router.replace("/login?reset=1");
    } catch (err) {
      setApiError(errorText(err));
    }
  };

  return (
    <Shell title="Choose a new password" subtitle="At least 8 characters.">
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div className="space-y-2">
          <label htmlFor="newPassword" className="text-sm font-medium">
            New password
          </label>
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-xs text-red-500">{errors.newPassword.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm new password
          </label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
        {apiError && (
          <p className="text-xs text-red-500">
            {apiError}{" "}
            <Link href="/forgot-password" className="font-semibold underline">
              Request a new link
            </Link>
          </p>
        )}
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Set new password"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </Shell>
  );
}
