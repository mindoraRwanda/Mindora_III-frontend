<<<<<<< HEAD
import { AppLayout } from "@/components/layout/AppLayout";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
=======
import { AppSidebar } from "@/components/layout/AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AppSidebar />
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
>>>>>>> 2b4f226 (Add UI-only auth and home pages from Figma designs.)
}
