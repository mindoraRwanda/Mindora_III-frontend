import { LoginForm } from "@/components/auth/LoginForm";
export default function TherapistLoginPage() {
  return (
    <main className="min-h-screen bg-white">
      <LoginForm therapistMode />
    </main>
  );
}
