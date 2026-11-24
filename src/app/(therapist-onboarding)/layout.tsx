import type { Metadata } from "next";
import { PendingTherapistSidebar } from "@/components/layout/PendingTherapistSidebar";
import { RouteGuard } from "@/components/auth/RouteGuard";

export const metadata: Metadata = {
  title: "Therapist Application — Mindora",
};

export default function TherapistOnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRole="PATIENT">
      <div className="flex h-screen overflow-hidden bg-white">
        <PendingTherapistSidebar />
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </RouteGuard>
  );
}
