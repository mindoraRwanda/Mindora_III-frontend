// app/dashboard/service/action.ts
'use server';

import { db } from '@/db'; 
import { service, Service } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getServices(): Promise<Service[]> {
  try {
    return await db.select().from(service).orderBy(desc(service.createdAt));
  } catch (error) {
    console.error('Error fetching services:', error);
    throw new Error('Failed to fetch services');
  }
}

export async function createService(serviceData: Omit<Service, 'id' | 'createdAt' | 'isActive'>) {
  try {
    const [newService] = await db.insert(service).values(serviceData).returning();
    return newService;
  } catch (error) {
    console.error('Error creating service:', error);
    throw new Error('Failed to create service');
  }
}

export async function updateService(id: number, serviceData: Partial<Omit<Service, 'id' | 'createdAt'>>) {
  try {
    const [updatedService] = await db
      .update(service)
      .set(serviceData)
      .where(eq(service.id, id))
      .returning();
    return updatedService;
  } catch (error) {
    console.error('Error updating service:', error);
    throw new Error('Failed to update service');
  }
}

export async function deleteService(id: number) {
  try {
    await db.delete(service).where(eq(service.id, id));
  } catch (error) {
    console.error('Error deleting service:', error);
    throw new Error('Failed to delete service');
  }
}