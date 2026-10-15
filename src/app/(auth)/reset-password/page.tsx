import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginBrandingPanel } from "@/components/auth/LoginBrandingPanel";
import { ResetPasswordForm } from "@/components/auth/PasswordResetForms";

// Auth Service's reset emails link to /reset-password?token=... on this app.
// The token is a live credential: never send it to other origins via Referer.
export const metadata: Metadata = {
  title: "Reset password - Mindora",
  referrer: "no-referrer",
};

export default function ResetPasswordPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <ResetPasswordForm />
      </Suspense>
      <LoginBrandingPanel />
    </div>
  );
}
