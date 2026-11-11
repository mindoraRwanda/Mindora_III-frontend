"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  CalendarClock,
  ClipboardList,
  Clock,
  FileText,
  LayoutDashboard,
  LogOut,
  Pill,
  Settings,
  Users,
  Video,
} from "lucide-react";
import { MindoraLogo } from "@/components/brand/MindoraLogo";
import { WorkspaceSupportCard } from "@/components/layout/WorkspaceSupportCard";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile } from "@/hooks/useMyProfile";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/therapist/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  { href: "/therapist", label: "Schedule", icon: CalendarClock },
  { href: "/therapist/availability", label: "Availability", icon: Clock },
  { href: "/therapist/patients", label: "Patients", icon: Users },
  {
    href: "/therapist/treatment-plans",
    label: "Treatment plans",
    icon: ClipboardList,
  },
  { href: "/therapist/medication", label: "Medication", icon: Pill },
  { href: "/therapist/prescriptions", label: "Prescriptions", icon: FileText },
  { href: "/therapist/reports", label: "Reports", icon: Activity },
  { href: "/therapist/communities", label: "Communities", icon: Users },
  { href: "/therapist/video-sessions", label: "Video sessions", icon: Video },
  { href: "/therapist/settings", label: "Settings", icon: Settings },
];

export function TherapistSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: profile } = useMyProfile();

  const displayName = profile?.profile?.userName ?? user?.email ?? "Therapist";

  async function handleSignOut() {
    // logout() clears local session state in its own finally block even if the
    // API call fails - always navigate away regardless of that outcome.
    try {
      await logout();
    } catch {
      // Already logged out locally; nothing more to do here.
    }
    router.push("/login");
  }

  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-mindora-sidebar text-white">
      <div className="flex items-center justify-between px-5 py-5">
        <MindoraLogo variant="light" size="md" />
        <NotificationBell />
      </div>

      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
          Your practice
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/therapist" && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[14px] font-medium transition-shadow",
                isActive
                  ? "font-bold text-white shadow-[inset_5px_5px_11px_#16131e,inset_-5px_-5px_11px_#2c273a]"
                  : "text-[#c6c0d8] hover:text-white hover:shadow-[5px_5px_12px_#171320,-5px_-5px_12px_#2b2638]"
              )}
            >
              <Icon
                className="h-4.5 w-4.5 shrink-0"
                strokeWidth={2.25}
                style={{ color: isActive ? "#a78bfa" : undefined }}
              />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {isActive && (
                <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-[#a78bfa]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 px-3 pb-4">
        <WorkspaceSupportCard />
        <div className="flex items-center gap-2.5 rounded-lg px-1 py-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mindora-purple text-xs font-semibold">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">{displayName}</p>
            <p className="text-[11px] text-white/45">Therapist</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-md p-1.5 text-white/45 hover:bg-white/5 hover:text-white"
            aria-label="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
