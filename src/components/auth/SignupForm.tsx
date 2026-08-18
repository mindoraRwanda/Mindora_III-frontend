"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Heart, Mountain, PenLine } from "lucide-react";
import { MindoraLogo } from "@/components/brand/MindoraLogo";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { joinReasons } from "@/lib/mock-data/auth";
import { cn } from "@/lib/utils";
import type { JoinReason } from "@/types/domain";
import { useAuth } from "@/contexts/AuthContext";
import { safeReturnUrl } from "@/lib/booking";
import { BackLink } from "@/components/public/BackLink";

const signupSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  reason: z.enum(["grounded", "routine", "reflect"]),
  terms: z.boolean().refine((val) => val === true, { message: "You must agree to continue" }),
});

type SignupForm = z.infer<typeof signupSchema>;

const reasonIcons = {
  heart: Heart,
  routine: Mountain,
  journal: PenLine,
};

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setToken } = useAuth();
  const [selectedReason, setSelectedReason] = useState<JoinReason>("grounded");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      reason: "grounded",
      terms: true,
    },
  });

  const password = watch("password");
  const termsAccepted = watch("terms");

  const onSubmit = (data: SignupForm) => {
    // UI-only mock session until Auth Service is ready
    console.log("Would register:", data);
    setToken("mock-access-token");
    setUser({
      userId: "usr-new-001",
      email: data.email,
      role: "PATIENT",
      userName: data.name,
    });
    router.push(safeReturnUrl(searchParams.get("returnUrl")));
  };

  return (
    <div className="flex h-full min-h-screen flex-col px-8 py-8 lg:px-12 lg:py-10 xl:px-16">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <BackLink fallback="/" />
          <MindoraLogo />
        </div>
        <p className="text-[13px] text-muted-foreground">
          Have an account?{" "}
          <Link href="/login" className="font-semibold text-mindora-purple hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-8">
        <h1 className="text-[32px] font-bold leading-tight tracking-tight text-foreground">
          Create your gentle space.
        </h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          Takes about 40 seconds—no clinical forms, promise.
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

          <div className="space-y-3">
            <p className="text-[13px] font-medium text-foreground/80">
              What brings you to Mindora?
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {joinReasons.map((reason) => {
                const Icon = reasonIcons[reason.icon as keyof typeof reasonIcons];
                const isSelected = selectedReason === reason.id;
                return (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => {
                      setSelectedReason(reason.id);
                      setValue("reason", reason.id);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border px-2 py-3.5 text-center text-[11px] font-medium leading-snug transition-colors",
                      isSelected
                        ? "border-mindora-purple bg-mindora-purple-pale text-mindora-purple"
                        : "border-border bg-white text-muted-foreground hover:border-mindora-purple/40"
                    )}
                  >
                    <Icon
                      className={cn("h-5 w-5", isSelected ? "text-mindora-purple" : "text-muted")}
                      strokeWidth={1.75}
                    />
                    {reason.label}
                  </button>
                );
              })}
            </div>
          </div>

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

          <Button type="submit" className="mt-1 h-12 w-full rounded-xl text-[15px]" size="lg">
            Create my space
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
