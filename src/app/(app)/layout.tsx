import { AppSidebar } from "@/components/layout/AppSidebar";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRole="PATIENT">
      <WorkspaceShell sidebar={<AppSidebar />} workspace="Patient">
        {children}
      </WorkspaceShell>
    </RouteGuard>
  );
}
