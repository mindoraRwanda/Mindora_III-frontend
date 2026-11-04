'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Users, Briefcase, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';

// Import the actions
import { getDashboardStats } from './action';

export default function DashboardHome() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalArticles: 0,
    totalEvents: 0,
    totalViews: 0,
    totalRegistrations: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats on mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const quickLinks = [
    { name: 'Team', path: '/team' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Service', path: '/service' },
    { name: 'Success Stories', path: '/success-stories' },
    { name: 'Hall of Fame', path: '/hall-of-fame' },
    { name: 'Our Stories', path: '/our-stories' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen overflow-y-auto p-8 bg-white space-y-10">
      {/* Header */}
      <header className="relative">
        <h1 className="text-5xl font-extrabold text-stone-900 tracking-tight">
          Dashboard <span className="text-indigo-500">Hub</span>
        </h1>
        <p className="mt-2 text-lg text-stone-500">Your control center for everything.</p>
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full opacity-20 blur-3xl"></div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Team Members', count: 12, subtitle: 'Active members', icon: <Users className="w-6 h-6 text-indigo-500" /> },
          { title: 'Open Jobs', count: stats.totalJobs, subtitle: 'Current openings', icon: <Briefcase className="w-6 h-6 text-indigo-500" /> },
          { title: 'Messages', count: 8, subtitle: 'Unread messages', icon: <MessageSquare className="w-6 h-6 text-indigo-500" /> },
        ].map((stat, index) => (
          <div
            key={index}
            className="group relative bg-white p-6 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-3">
              {stat.icon}
              <div>
                <h2 className="text-lg font-medium text-stone-700">{stat.title}</h2>
                <p className="text-3xl font-bold text-stone-900">
                  {loading ? '...' : stat.count}
                </p>
                <p className="text-sm text-stone-500">{stat.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
        <h2 className="text-2xl font-semibold text-stone-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => router.push(link.path)}
              className="group flex items-center justify-between bg-white text-stone-900 px-5 py-3 rounded-lg border border-stone-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 shadow-sm"
            >
              <span className="font-medium group-hover:text-indigo-600">Manage {link.name}</span>
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-indigo-600 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
        <h2 className="text-2xl font-semibold text-stone-900 mb-6">Recent Activity</h2>
        <ul className="space-y-4 text-stone-600 text-sm">
          {[
            { text: 'Added new team member:', highlight: 'Jane Smith', emoji: '✅' },
            { text: 'Posted job:', highlight: 'Frontend Developer', emoji: '📢' },
            { text: 'Updated success story:', highlight: 'Project A', emoji: '📖' },
          ].map((activity, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span className="text-lg">{activity.emoji}</span>
              <span>{activity.text}</span>
              <span className="font-medium text-stone-900">{activity.highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Floating Decorative Element */}
      <div className="fixed bottom-0 right-0 w-40 h-40 bg-indigo-100 rounded-full opacity-10 blur-3xl pointer-events-none"></div>
    </div>
  );
}