import { Suspense } from "react";
import { LoginBrandingPanel } from "@/components/auth/LoginBrandingPanel";
import { ForgotPasswordForm } from "@/components/auth/PasswordResetForms";

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <ForgotPasswordForm />
      </Suspense>
      <LoginBrandingPanel />
    </div>
  );
}
