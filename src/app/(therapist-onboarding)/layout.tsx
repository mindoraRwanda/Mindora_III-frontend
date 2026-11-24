import type { Metadata } from "next";
import { MindoraLogo } from "@/components/brand/MindoraLogo";
import { RouteGuard } from "@/components/auth/RouteGuard";

export const metadata: Metadata = {
  title: "Therapist Application — Mindora",
};

export default function TherapistOnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRole="PATIENT">
      <div className="flex min-h-screen flex-col bg-[#eae6f4]">
        <header className="flex items-center px-6 py-5">
          <MindoraLogo size="md" href="/today" />
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </RouteGuard>
  );
}
