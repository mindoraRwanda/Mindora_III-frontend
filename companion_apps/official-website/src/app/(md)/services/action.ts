// app/dashboard/service/action.ts
'use server';

import { db } from '@/db'; 
import { service, Service,  successStories } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function getServices(): Promise<Service[]> {
  try {
    return await db.select().from(service).orderBy(desc(service.createdAt));
  } catch (error) {
    console.error('Error fetching services:', error);
    throw new Error('Failed to fetch services');
  }
}

export async function getStories() {
  return await db.select().from(successStories).orderBy(successStories.createdAt);
}


