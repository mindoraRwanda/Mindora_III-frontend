'use server';

import { db } from '@/db';
import { partners } from '@/db/schema';




// Get all partners
export async function getPartners() {
  try {
    const allPartners = await db.select().from(partners);
    return allPartners;
  } catch (error) {
    console.error('Error fetching partners:', error);
    throw new Error('Failed to fetch partners');
  }
}
