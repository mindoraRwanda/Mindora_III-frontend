'use server';

import { db } from '@/db';
import { contactMessage } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

interface NewContactMessage {
  name: string;
  email: string;
  organization?: string;
  // Required on the Contact form, optional on the Request-a-Demo form -
  // enforced client-side per form, not here.
  message?: string;
  source: 'contact' | 'demo';
}

// Public - called from both the Contact page and the Request-a-Demo page.
// No auth gate here deliberately (same as every other public-facing write
// path in this app, e.g. a future newsletter signup) - anyone should be
// able to submit an inquiry without logging in.
export async function createContactMessage(data: NewContactMessage) {
  try {
    if (!data.name || !data.email) {
      throw new Error('Missing required fields: name and email');
    }

    const created = await db.insert(contactMessage).values({
      name: data.name,
      email: data.email,
      organization: data.organization || null,
      message: data.message || null,
      source: data.source,
    }).returning();

    return created[0];
  } catch (error) {
    console.error('Error creating contact message:', error);
    throw new Error('Failed to submit message');
  }
}

export async function getContactMessages() {
  try {
    return await db.select().from(contactMessage).orderBy(desc(contactMessage.createdAt));
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    throw new Error('Failed to fetch contact messages');
  }
}

export async function markContactMessageRead(id: number) {
  try {
    const updated = await db.update(contactMessage)
      .set({ isRead: true })
      .where(eq(contactMessage.id, id))
      .returning();

    if (!updated.length) {
      throw new Error('Message not found');
    }

    return updated[0];
  } catch (error) {
    console.error('Error marking contact message read:', error);
    throw new Error('Failed to update message');
  }
}

export async function deleteContactMessage(id: number) {
  try {
    const deleted = await db.delete(contactMessage)
      .where(eq(contactMessage.id, id))
      .returning();

    if (!deleted.length) {
      throw new Error('Message not found');
    }

    return deleted[0];
  } catch (error) {
    console.error('Error deleting contact message:', error);
    throw new Error('Failed to delete message');
  }
}
