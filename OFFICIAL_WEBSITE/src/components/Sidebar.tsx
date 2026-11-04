'use client';

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useState } from 'react';
import {
  Earth,
  Users,
  Briefcase,
  Wrench,
  Trophy,
  Star,
  BookOpen,
  Mail,
  ChevronLeft,
  ChevronRight,
  Hotel, 
  LogOut,
  LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const navItems: NavItem[] = [
    {name: 'Dashboard', href: '/dashboard', icon: Earth},
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Service', href: '/service', icon: Wrench },
    { name: 'Partners', href: '/partners', icon: Hotel},
    { name: 'Success Stories', href: '/success-stories', icon: Trophy },
    { name: 'Hall of Fame', href: '/hall-of-fame', icon: Star },
    { name: 'Our Stories', href: '/our-stories', icon: BookOpen },
    { name: 'Contact', href: '/contact-msg', icon: Mail },
  ];

  return (
    <div
      className={cn(
        'flex flex-col h-screen top-0 left-0 bg-brand-600 text-white transition-all duration-300 z-50',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-brand-700">
        {!isCollapsed && <span className="text-xl font-bold">Mindora</span>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-full hover:bg-brand-700 focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center p-2 my-1 rounded-lg hover:bg-brand-700 transition-colors',
              isCollapsed ? 'justify-center' : 'space-x-3'
            )}
          >
            <item.icon size={20} className={cn(isCollapsed && 'w-5 h-5')} />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="p-2 border-t border-brand-700">
        <button
          className={cn(
            'flex items-center w-full p-2 rounded-lg hover:bg-brand-700 transition-colors',
            isCollapsed ? 'justify-center' : 'space-x-3'
          )}
          aria-label="Log out"
        >
          <LogOut size={20} />
          {!isCollapsed && (
            <span>
              <LogoutLink>Log out</LogoutLink>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;