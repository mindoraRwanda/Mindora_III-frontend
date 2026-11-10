import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRole="ADMIN">
      <WorkspaceShell sidebar={<AdminSidebar />} workspace="Admin">
        {children}
      </WorkspaceShell>
    </RouteGuard>
  );
}
