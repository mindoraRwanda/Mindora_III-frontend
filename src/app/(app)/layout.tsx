import { AppSidebar } from "@/components/layout/AppSidebar";
import { RouteGuard } from "@/components/auth/RouteGuard";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard>
      <div className="flex h-screen overflow-hidden bg-bg-dark">
        <AppSidebar />
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </RouteGuard>
  );
}
