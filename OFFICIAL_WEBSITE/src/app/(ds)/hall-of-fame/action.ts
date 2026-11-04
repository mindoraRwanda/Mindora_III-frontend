'use server';

import { db } from '@/db';
import { hallOfFame } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface HallOfFameMember {
  id?: number;
  name: string;
  role: string;
  image?: string;
}

export async function getHallOfFame() {
  try {
    const allMembers = await db.select().from(hallOfFame);
    return allMembers;
  } catch (error) {
    console.error('Error fetching Hall of Fame members:', error);
    throw new Error('Failed to fetch Hall of Fame members');
  }
}

export async function getHallOfFameMember(id: number) {
  try {
    const member = await db.select().from(hallOfFame).where(eq(hallOfFame.id, id));

    if (!member.length) {
      throw new Error('Hall of Fame member not found');
    }

    return member[0];
  } catch (error) {
    console.error('Error fetching Hall of Fame member:', error);
    throw new Error('Failed to fetch Hall of Fame member');
  }
}

// Create a new Hall of Fame member
export async function createHallOfFame(data: HallOfFameMember) {
  try {
    if (!data.name || !data.role) {
      throw new Error('Missing required fields: name and role');
    }

    const newMember = await db.insert(hallOfFame).values({
      name: data.name,
      role: data.role,
      image: data.image || null,
    }).returning();

    return newMember[0];
  } catch (error) {
    console.error('Error creating Hall of Fame member:', error);
    throw new Error('Failed to create Hall of Fame member');
  }
}

export async function updateHallOfFame(id: number, data: HallOfFameMember) {
  try {
    if (!data.name || !data.role) {
      throw new Error('Missing required fields: name and role');
    }

    const updatedMember = await db.update(hallOfFame)
      .set({
        name: data.name,
        role: data.role,
        image: data.image || null,
      })
      .where(eq(hallOfFame.id, id))
      .returning();

    if (!updatedMember.length) {
      throw new Error('Hall of Fame member not found');
    }

    return updatedMember[0];
  } catch (error) {
    console.error('Error updating Hall of Fame member:', error);
    throw new Error('Failed to update Hall of Fame member');
  }
}

// Delete a Hall of Fame member
export async function deleteHallOfFame(id: number) {
  try {
    const deletedMember = await db.delete(hallOfFame)
      .where(eq(hallOfFame.id, id))
      .returning();

    if (!deletedMember.length) {
      throw new Error('Hall of Fame member not found');
    }

    return deletedMember[0];
  } catch (error) {
    console.error('Error deleting Hall of Fame member:', error);
    throw new Error('Failed to delete Hall of Fame member');
  }
}
