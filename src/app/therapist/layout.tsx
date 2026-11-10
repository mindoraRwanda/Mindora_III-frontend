import { TherapistSidebar } from "@/components/layout/TherapistSidebar";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";

export default function TherapistLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRole="THERAPIST">
      <WorkspaceShell sidebar={<TherapistSidebar />} workspace="Therapist">
        {children}
      </WorkspaceShell>
    </RouteGuard>
  );
}
