import { AppSidebar } from "@/components/layout/AppSidebar";
import { PendingApplicationBanner } from "@/components/layout/PendingApplicationBanner";
import { RouteGuard } from "@/components/auth/RouteGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRole="PATIENT">
      <div className="flex h-screen overflow-hidden bg-white">
        <AppSidebar />
        <div className="flex min-h-0 flex-1 flex-col">
          <PendingApplicationBanner />
          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </RouteGuard>
  );
}
