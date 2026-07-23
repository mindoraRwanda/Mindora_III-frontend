import { LoginBrandingPanel } from "@/components/auth/LoginBrandingPanel";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <LoginForm />
      <LoginBrandingPanel />
    </div>
  );
}
