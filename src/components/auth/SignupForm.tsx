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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { safeReturnUrl } from "@/lib/booking";
import { BackLink } from "@/components/public/BackLink";
import { ApiError, getGoogleOAuthUrl } from "@/lib/api";
import { dashboardPathForRole } from "@/lib/roles";

const signupSchema = z
  .object({
    name: z.string().min(2, "Please enter your name"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).{8,128}$/,
        "Use at least 8 characters with letters and numbers"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.boolean().refine((val) => val === true, { message: "You must agree to continue" }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type SignupForm = z.infer<typeof signupSchema>;

export function SignupForm({ therapistFlow = false }: { therapistFlow?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerAccount } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const returnUrl = searchParams.get("returnUrl");

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      // Must start unchecked - a pre-ticked consent checkbox lets someone
      // submit without ever affirmatively agreeing to anything, which isn't
      // valid consent for a platform handling health data.
      terms: false,
    },
  });

  const password = watch("password");
  const termsAccepted = watch("terms");

  const onSubmit = async (data: SignupForm) => {
    setApiError(null);
    try {
      const user = await registerAccount({
        email: data.email,
        password: data.password,
        role: "PATIENT",
        userName: data.name,
      });
      router.push(
        therapistFlow
          ? "/therapist-application/new"
          : returnUrl
            ? safeReturnUrl(returnUrl)
            : dashboardPathForRole(user.role)
      );
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        const formFieldForServerField: Record<string, keyof SignupForm> = {
          email: "email",
          password: "password",
          userName: "name",
        };
        let mappedAny = false;
        for (const [serverField, messages] of Object.entries(err.fieldErrors)) {
          const formField = formFieldForServerField[serverField];
          if (formField && messages[0]) {
            setError(formField, { message: messages[0] });
            mappedAny = true;
          }
        }
        if (!mappedAny) setApiError(err.message);
      } else {
        setApiError(
          err instanceof ApiError ? err.message : "Something went wrong. Please try again."
        );
      }
    }
  };

  return (
    <div className="flex h-full min-h-screen flex-col px-8 py-8 lg:px-12 lg:py-10 xl:px-16">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <BackLink fallback="/" />
          <MindoraLogo />
        </div>
        <div className="flex items-center gap-4">
          <Link\n            href="/tests"\n            className="text-sm font-semibold text-mindora-purple hover:underline"\n          >\n            Tests\n          </Link>
        <p className="text-[13px] text-muted-foreground">
          Have an account?{" "}
          <Link
            href={
              therapistFlow
                ? "/therapist/login"
                : returnUrl
                  ? `/login?returnUrl=${encodeURIComponent(returnUrl)}`
                  : "/login"
            }
            className="font-semibold text-mindora-purple hover:underline"
          >
            Sign in
          </Link>
        </p>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-8">
        <h1 className="text-[32px] font-bold leading-tight tracking-tight text-foreground">
          {therapistFlow ? "Apply to join our therapist network." : "Create your gentle space."}
        </h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          Takes about 40 seconds - no clinical forms, promise.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-[13px] font-medium text-foreground/80">
              What should we call you?
            </label>
            <Input id="name" placeholder="Theodora" {...register("name")} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[13px] font-medium text-foreground/80">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="theodora@mindora.app"
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-[13px] font-medium text-foreground/80">
              Password
            </label>
            <PasswordInput id="password" showStrength value={password} {...register("password")} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-[13px] font-medium text-foreground/80">
              Confirm password
            </label>
            <PasswordInput
              id="confirmPassword"
              value={watch("confirmPassword")}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Use at least 8 characters, including letters and numbers.
          </p>

          <div className="flex items-start gap-3 pt-1">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setValue("terms", checked === true)}
              className="mt-0.5"
            />
            <label htmlFor="terms" className="text-[12px] leading-relaxed text-muted-foreground">
              I agree to Mindora&apos;s{" "}
              <span className="font-medium text-mindora-purple">Terms</span> and{" "}
              <span className="font-medium text-mindora-purple">Privacy Notice</span>. Mindora is
              not a crisis service.
            </label>
          </div>
          {errors.terms && <p className="text-xs text-red-500">{errors.terms.message}</p>}

          {apiError && <p className="text-xs text-red-500">{apiError}</p>}

          <Button
            type="submit"
            className="mt-1 h-12 w-full rounded-xl text-[15px]"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Creating your space..."
              : therapistFlow
                ? "Create account and apply"
                : "Create my space"}
            <ArrowRight className="h-4 w-4" />
          </Button>

          {!therapistFlow && (
            <>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-muted-foreground">or sign up with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
                disabled={!termsAccepted || isSubmitting}
                onClick={() => {
                  window.location.href = getGoogleOAuthUrl();
                }}
              >
                <GoogleIcon />
                Continue with Google
              </Button>
              {!termsAccepted && (
                <p className="text-center text-xs text-muted-foreground">
                  Agree to the Terms and Privacy Notice above to continue with Google.
                </p>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
