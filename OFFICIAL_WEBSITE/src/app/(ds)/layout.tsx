import Sidebar from '@/components/Sidebar';
import { ReactNode } from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return (
    <div className="flex min-h-screen h-screen overflow-hidden">
      {/* Sidebar is already fixed in its own component */}
      <Sidebar />
      
      {/* Content area that adjusts to sidebar width automatically */}
      <div className="flex-1 flex flex-col h-full w-full">
        {/* Sticky header */}
        <header className="sticky top-0 z-10 bg-white shadow-sm p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brand-600">Mindora</h1>
          <div className="flex items-center space-x-4">
            <span className="text-stone-700">{`${user.family_name} ${user.given_name}`}</span>
            <div className="h-10 w-10 rounded-full bg-brand-200 flex items-center justify-center text-brand-600 font-bold">
              {user.family_name?.[0] || user.given_name?.[0] || 'U'}
            </div>
          </div>
        </header>
        
        {/* Scrollable main content */}
        <main className="flex-1 p-6 overflow-y-auto bg-stone-100">{children}</main>
      </div>
    </div>
  );
}