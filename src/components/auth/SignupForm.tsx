"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Feather, Heart, Sparkles } from "lucide-react";
import { MindoraLogo } from "@/components/brand/MindoraLogo";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { joinReasons } from "@/lib/mock-data/auth";
import { cn } from "@/lib/utils";
import type { JoinReason } from "@/types/domain";

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
  sparkles: Sparkles,
  feather: Feather,
};

export function SignupForm() {
  const router = useRouter();
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
    console.log("Would register:", data);
    router.push("/today");
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between">
        <MindoraLogo />
        <p className="text-sm text-muted-foreground">
          Have an account?{" "}
          <Link href="/login" className="font-semibold text-mindora-purple hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
        <h1 className="text-3xl font-bold tracking-tight">Create your gentle space.</h1>
        <p className="mt-2 text-muted-foreground">
          Takes about 40 seconds—no clinical forms, promise.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              What should we call you?
            </label>
            <Input id="name" placeholder="Theodora" {...register("name")} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
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

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <PasswordInput id="password" showStrength value={password} {...register("password")} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">What brings you to Mindora?</p>
            <div className="grid grid-cols-3 gap-3">
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
                      "flex flex-col items-center gap-2 rounded-xl border p-4 text-center text-xs font-medium transition-colors",
                      isSelected
                        ? "border-mindora-purple bg-mindora-purple-pale text-mindora-purple"
                        : "border-border bg-white text-muted hover:border-mindora-purple/40"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {reason.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setValue("terms", checked === true)}
            />
            <label htmlFor="terms" className="text-xs leading-relaxed text-muted-foreground">
              I agree to Mindora&apos;s <span className="text-mindora-purple">Terms</span> and{" "}
              <span className="text-mindora-purple">Privacy Notice</span>. Mindora is not a crisis
              service.
            </label>
          </div>
          {errors.terms && <p className="text-xs text-red-500">{errors.terms.message}</p>}

          <Button type="submit" className="w-full" size="lg">
            Create my space
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
