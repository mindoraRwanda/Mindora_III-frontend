
'use server';

import { db } from '@/db';
import { team } from '@/db/schema';

export async function getTeamMembers() {
  try {
    const allTeamMembers = await db.select().from(team);
    return allTeamMembers;
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw new Error('Failed to fetch team members');
  }
}






