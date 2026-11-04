"use client";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NavigationMenu, NavigationMenuList, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { useState, useEffect } from "react";
import { ModeToggle } from "@/components/ModeToggle";
import SignalMark from "@/components/SignalMark";
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigationItems = [
    { href: "/home", label: "Home" },
    { href: "/about", label: "About us" },
    { href: "/services", label: "Services" },
    { href: "/news", label: "Our Impact" },
    { href: "/career", label: "Careers" },
    { href: "/contact", label: "Contact us" }
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${
        isScrolled
          ? "bg-ink/95 shadow-sm h-16"
          : "bg-ink/35 h-20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden relative text-paper hover:bg-paper/10 hover:text-paper"
            >
              {isMobileOpen ? (
                <X className="h-6 w-6 transition-transform duration-200" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-200" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-ink border-ink-700 text-paper">
            <div className="mt-8 flex flex-col space-y-6">
              {navigationItems.map((item) => (
                <MobileNavLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.label}
                </MobileNavLink>
              ))}
              <Button asChild className="w-full rounded-sm bg-brand-600 hover:bg-brand-700 text-paper uppercase tracking-wide text-sm font-display">
                <Link href="https://app.mindora.rw/">
                  Access the App
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>


        <Link href="/" className="flex items-center gap-3">
          <SignalMark className="h-6 w-6 text-brand-500" />
          <span className="font-display text-xl font-bold tracking-wide text-paper">MINDORA</span>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-paper/50 sm:inline">Health</span>
        </Link>


        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="flex space-x-1">
            {navigationItems.map((item) => (
              <DesktopNavLink
                key={item.href}
                href={item.href}
                isActive={activeLink === item.href}
                onMouseEnter={() => setActiveLink(item.href)}
                onMouseLeave={() => setActiveLink("")}
              >
                {item.label}
              </DesktopNavLink>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button
            asChild
            variant="default"
            className="hidden md:inline-flex rounded-sm bg-brand-600 hover:bg-brand-700 text-paper font-display font-bold uppercase tracking-wide text-xs px-5"
          >
            <Link href="https://app.mindora.rw/">
              Access the App
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

function MobileNavLink({ href, children, onClick }: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center space-x-2 text-lg font-medium text-paper/80
        hover:text-brand-400 transition-colors duration-200
        group relative py-2"
    >
      <span className="absolute left-0 w-0 h-0.5 bg-brand-500 group-hover:w-full transition-all duration-300" />
      {children}
    </Link>
  );
}

function DesktopNavLink({
  href,
  children,
  isActive,
  onMouseEnter,
  onMouseLeave
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className={`relative group px-4 py-2 rounded-sm transition-all duration-300 text-sm
          ${isActive
            ? 'text-brand-400'
            : 'text-paper/75'
          }`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <span className="relative z-10">{children}</span>
        <span className={`absolute inset-0 bg-brand-500/15
          rounded-sm scale-0 group-hover:scale-100 transition-transform
          duration-300 ease-out ${isActive ? 'scale-100' : ''}`}
        />
      </Link>
    </NavigationMenuLink>
  );
}
