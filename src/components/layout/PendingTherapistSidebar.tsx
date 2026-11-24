"use client";

import { useRouter } from "next/navigation";
import { CalendarClock, Clock, LayoutDashboard, Lock, LogOut, Settings, Users } from "lucide-react";
import { MindoraLogo } from "@/components/brand/MindoraLogo";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile } from "@/hooks/useMyProfile";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Schedule", icon: CalendarClock },
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Availability", icon: Clock },
  { label: "Patients", icon: Users },
  { label: "Settings", icon: Settings },
];

export function PendingTherapistSidebar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: profile } = useMyProfile();

  const displayName = profile?.profile?.userName ?? user?.email ?? "Therapist";

  async function handleSignOut() {
    try {
      await logout();
    } catch {
      // Already logged out locally.
    }
    router.push("/login");
  }

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col self-stretch bg-mindora-sidebar text-white">
      <div className="flex items-center justify-between px-5 py-5">
        <MindoraLogo variant="light" size="md" />
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
          Your practice
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={cn(
                "flex cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium",
                "text-white/25"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {item.label}
              <Lock className="ml-auto h-3 w-3" />
            </div>
          );
        })}
      </nav>

      <div className="space-y-3 px-3 pb-4">
        <div className="rounded-lg bg-white/5 px-3 py-2.5">
          <p className="text-[11px] font-semibold text-amber-300">Pending approval</p>
          <p className="mt-0.5 text-[10px] text-white/40">
            Your dashboard will unlock once your application is approved.
          </p>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg px-1 py-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mindora-purple text-xs font-semibold">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">{displayName}</p>
            <p className="text-[11px] text-white/45">Applicant</p>
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
