// app/partners/actions.ts
'use server';

import { db } from '@/db';
import { partners } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface Partner {
  id?: number;
  name: string;
  image?: string;
}

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

// Get a single partner by ID
export async function getPartner(id: number) {
  try {
    const partner = await db.select().from(partners).where(eq(partners.id, id));

    if (!partner.length) {
      throw new Error('Partner not found');
    }

    return partner[0];
  } catch (error) {
    console.error('Error fetching partner:', error);
    throw new Error('Failed to fetch partner');
  }
}

// Create a new partner
export async function createPartner(data: Partner) {
  try {
    if (!data.name) {
      throw new Error('Missing required field: name');
    }

    const newPartner = await db.insert(partners).values({
      name: data.name,
      image: data.image || null,
    }).returning();

    return newPartner[0];
  } catch (error) {
    console.error('Error creating partner:', error);
    throw new Error('Failed to create partner');
  }
}

// Update an existing partner
export async function updatePartner(id: number, data: Partner) {
  try {
    if (!data.name) {
      throw new Error('Missing required field: name');
    }

    const updatedPartner = await db.update(partners)
      .set({
        name: data.name,
        image: data.image || null,
      })
      .where(eq(partners.id, id))
      .returning();

    if (!updatedPartner.length) {
      throw new Error('Partner not found');
    }

    return updatedPartner[0];
  } catch (error) {
    console.error('Error updating partner:', error);
    throw new Error('Failed to update partner');
  }
}

// Delete a partner
export async function deletePartner(id: number) {
  try {
    const deletedPartner = await db.delete(partners)
      .where(eq(partners.id, id))
      .returning();

    if (!deletedPartner.length) {
      throw new Error('Partner not found');
    }

    return deletedPartner[0];
  } catch (error) {
    console.error('Error deleting partner:', error);
    throw new Error('Failed to delete partner');
  }
}
