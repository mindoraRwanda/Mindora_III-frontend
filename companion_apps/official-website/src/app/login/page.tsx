import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="h-dvh flex flex-col items-center justify-center bg-gradient-to-br from-brand-700 to-indigo-900 text-white p-6">
      <div className="flex flex-col items-center text-center">
        <ShieldCheck className="w-16 h-16 text-white mb-4" />
        <h1 className="text-5xl font-extrabold tracking-wide">Mindora Admin</h1>
        <p className="text-lg text-stone-200 mt-2 max-w-md">
          Secure access to Mindora Health’s admin dashboard. Please log in to continue.
        </p>
      </div>

      <Button className="mt-8 px-6 py-3 text-lg bg-white text-brand-700 hover:bg-stone-200 transition flex items-center gap-2">
        <LogIn className="w-5 h-5" />
        <LoginLink>Log in</LoginLink>
      </Button>
    </main>
  );
}
