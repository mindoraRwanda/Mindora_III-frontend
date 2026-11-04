'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import type { ContactMessage } from '@/db/schema';
import { deleteContactMessage, getContactMessages, markContactMessageRead } from './action';

export default function ContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'contact' | 'demo'>('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await getContactMessages();
      setMessages(data);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete message');
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await markContactMessageRead(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
    } catch {
      toast.error('Failed to update message');
    }
  };

  const visibleMessages = messages.filter((m) => filter === 'all' || m.source === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-600">Contact Messages</h1>
        <div className="flex gap-2">
          {(['all', 'contact', 'demo'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize ${
                filter === f ? 'bg-brand-600 text-white' : 'bg-white text-stone-600 hover:bg-stone-100'
              }`}
            >
              {f === 'demo' ? 'Demo requests' : f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-stone-600 text-center py-12">Loading...</p>
      ) : (
        <div className="space-y-4">
          {visibleMessages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                !msg.isRead ? 'border-l-4 border-l-brand-600' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-stone-800">{msg.name}</h2>
                  <p className="text-stone-600">{msg.email}</p>
                  {msg.organization && (
                    <p className="text-sm text-stone-500">{msg.organization}</p>
                  )}
                </div>
                <span className="text-xs font-medium uppercase tracking-wide text-stone-400 bg-stone-100 px-2 py-1 rounded">
                  {msg.source === 'demo' ? 'Demo request' : 'Contact'}
                </span>
              </div>
              <p className="text-stone-600 mt-2 whitespace-pre-wrap">
                {msg.message || <span className="italic text-stone-400">No message provided</span>}
              </p>
              <p className="text-xs text-stone-400 mt-2">
                {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}
              </p>
              <div className="mt-4 flex gap-4">
                {!msg.isRead && (
                  <button
                    onClick={() => handleMarkRead(msg.id)}
                    className="text-brand-600 hover:underline font-medium"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="text-red-600 hover:underline font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {visibleMessages.length === 0 && (
            <p className="text-stone-600 text-center py-12">No messages yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
