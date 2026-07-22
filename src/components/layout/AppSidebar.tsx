"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarHeart,
  Circle,
  Flame,
  Home,
  LogOut,
  MessageCircleHeart,
  PenLine,
  RefreshCw,
} from "lucide-react";
import { MindoraLogo } from "@/components/brand/MindoraLogo";
import { Button } from "@/components/ui/button";
import { mockCurrentUser } from "@/lib/mock-data/user";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/today", label: "Today", icon: Home },
  { href: "/check-in", label: "Check-in", icon: RefreshCw },
  { href: "/therapy", label: "Therapy", icon: CalendarHeart },
  { href: "/reflect", label: "Reflect", icon: PenLine },
  { href: "/circle", label: "Circle", icon: Circle },
];

export function AppSidebar() {
  const pathname = usePathname();
  const user = mockCurrentUser;

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col self-stretch bg-mindora-sidebar text-white">
      <div className="px-5 py-5">
        <MindoraLogo variant="light" size="md" />
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
          Your day
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/55 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 px-3 pb-4">
        <div className="rounded-xl bg-mindora-card-dark px-3.5 py-3.5">
          <p className="text-[11px] leading-relaxed text-white/65">
            Need someone now? 24/7 crisis response — always free, always answered
          </p>
          <Button className="mt-2.5 h-9 w-full text-xs" size="sm">
            <MessageCircleHeart className="h-3.5 w-3.5" />
            Talk to our Chatbot
          </Button>
        </div>

        <div className="flex items-center gap-2.5 rounded-lg px-1 py-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mindora-purple text-xs font-semibold">
            {user.avatarInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">{user.name}</p>
            <p className="text-[11px] text-white/45">Member</p>
          </div>
          <button
            type="button"
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

export function StreakBadge({ days }: { days: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl bg-mindora-purple px-3.5 py-2 text-white shadow-sm">
      <Flame className="h-4 w-4 shrink-0" fill="currentColor" />
      <div className="text-left leading-tight">
        <p className="text-[10px] font-medium text-white/80">Current streak</p>
        <p className="text-sm font-bold">{days} days</p>
      </div>
    </div>
  );
}
