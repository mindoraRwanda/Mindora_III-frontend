"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Menu, ShieldCheck, X } from "lucide-react";

type WorkspaceShellProps = {
  sidebar: ReactNode;
  workspace: "Patient" | "Therapist" | "Admin";
  children: ReactNode;
};

const ROUTE_TITLES: Record<string, string> = {
  "/today": "Today",
  "/check-in": "Check-in",
  "/therapy": "Therapy",
  "/messages": "Messages",
  "/reflect": "Reflect with AI",
  "/therapist-application": "Become a therapist",
  "/settings": "Settings",
  "/therapist": "Schedule",
  "/therapist/dashboard": "Dashboard",
  "/therapist/availability": "Availability",
  "/therapist/patients": "Patients",
  "/therapist/treatment-plans": "Treatment plans",
  "/therapist/medication": "Medication",
  "/therapist/prescriptions": "Prescriptions",
  "/therapist/reports": "Reports",
  "/therapist/communities": "Communities",
  "/therapist/video-sessions": "Video sessions",
  "/therapist/settings": "Settings",
  "/admin": "Overview",
  "/admin/therapist-applications": "Therapist applications",
  "/admin/alerts": "System alerts",
  "/admin/users": "Users",
  "/admin/appointments": "Appointments",
  "/admin/audit-log": "Audit log",
  "/admin/notifications": "Notifications",
  "/admin/release-readiness": "Release readiness",
  "/admin/analytics": "Analytics",
  "/admin/moderation": "Moderation",
};

function getPageTitle(pathname: string): string {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  return lastSegment
    ? lastSegment
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Workspace";
}

export function WorkspaceShell({ sidebar, workspace, children }: WorkspaceShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageTitle = getPageTitle(pathname);

  function closeAfterNavigation(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest("a")) {
      setMobileOpen(false);
    }
  }

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-[#f7f6fa]">
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-[#21182c]/55 md:hidden"
        />
      ) : null}

      <div
        onClick={closeAfterNavigation}
        className={[
          "fixed inset-y-0 left-0 z-50 w-[260px] transition-transform duration-200 ease-out",
          "md:relative md:z-auto md:w-[244px] md:shrink-0 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="h-full min-h-0 [&>aside]:h-full [&>aside]:w-full [&>aside]:min-h-0">
          {sidebar}
        </div>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[68px] shrink-0 items-center justify-between gap-3 border-b border-[#ebe8f1] bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#ebe8f1] bg-white text-[#51445f] shadow-sm md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8a789d]">
                MINDORA · {workspace} workspace
              </p>
              <h1 className="truncate text-[15px] font-bold text-[#28243a]">{pageTitle}</h1>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#e4eee8] bg-[#f3faf6] px-3 py-2 text-[10px] font-bold text-[#39765e]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure workspace
          </span>
        </header>
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
