// app/actions/successStories.ts
'use server';

import { db } from '@/db'; // Adjust path to your DB client
import { successStories } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getStories() {
  return await db.select().from(successStories).orderBy(successStories.createdAt);
}

export async function addStory(formData: {
  text: string;
  author: string;
  role: string;
}) {
  await db.insert(successStories).values(formData);
}

export async function updateStory(id: number, data: {
  text: string;
  author: string;
  role: string;
}) {
  await db.update(successStories).set(data).where(eq(successStories.id, id));
}

export async function deleteStory(id: number) {
  await db.delete(successStories).where(eq(successStories.id, id));
}
