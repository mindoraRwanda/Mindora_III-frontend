import { SignupBrandingPanel } from "@/components/auth/SignupBrandingPanel";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <SignupBrandingPanel />
      <div className="flex flex-col p-8 lg:p-14">
        <SignupForm />
      </div>
    </div>
  );
}
