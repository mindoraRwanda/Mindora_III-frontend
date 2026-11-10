"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  Calendar,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PenLine,
  Settings,
} from "lucide-react";
import { MindoraLogo } from "@/components/brand/MindoraLogo";
import { WorkspaceSupportCard } from "@/components/layout/WorkspaceSupportCard";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile } from "@/hooks/useMyProfile";
import { useMoodToday } from "@/hooks/useMood";
import { cn } from "@/lib/utils";

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const navItems = [
  { href: "/today", label: "Today", icon: Home },
  { href: "/check-in", label: "Check-in", icon: Heart },
  { href: "/therapy", label: "Therapy", icon: Calendar },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/reflect", label: "Reflect with AI", icon: PenLine },
  { href: "/therapist-application", label: "Become a Therapist", icon: Briefcase },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: profile } = useMyProfile();
  const { data: today } = useMoodToday();

  const displayName = profile?.profile?.userName ?? user?.email ?? "User";
  const roleLabel = user ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : "Member";
  const checkInDue = today ? !today.hasCheckedIn : false;

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
        <MindoraLogo variant="light" size="md" href="/today" />
        <NotificationBell />
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        <p className="mb-1 px-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#6d6588]">
          Your day
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const showDue = item.href === "/check-in" && checkInDue;
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
              {isActive && !showDue && (
                <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-[#a78bfa]" />
              )}
              {showDue && (
                <span className="ml-auto shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-bold text-[#c4b5fd] shadow-[inset_2px_2px_5px_#17131f,inset_-2px_-2px_5px_#2c273a]">
                  Due
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-3.5 px-3 pb-4">
        <WorkspaceSupportCard />

        <div className="flex items-center gap-2.5 rounded-2xl px-2 py-2 transition-shadow hover:shadow-[5px_5px_12px_#171320,-5px_-5px_12px_#2b2638]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mindora-sidebar-elevated text-xs font-bold text-[#c4b5fd] shadow-[inset_3px_3px_7px_#16131e,inset_-3px_-3px_7px_#302a41]">
            {initialsFor(displayName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white">{displayName}</p>
            <p className="text-[11px] text-[#8d84a6]">{roleLabel}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-md p-1.5 text-[#8d84a6] hover:text-white"
            aria-label="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
