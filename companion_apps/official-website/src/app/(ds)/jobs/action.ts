// app/dashboard/jobs/action.ts
'use server';

import { db } from '@/db'; 
import { job, Job } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getJobs(): Promise<Job[]> {
  try {
    return await db.select().from(job).orderBy(desc(job.postedAt));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Failed to fetch jobs');
  }
}

export async function createJob(jobData: Omit<Job, 'id' | 'postedAt' | 'isActive'>) {
  try {
    const [newJob] = await db.insert(job).values(jobData).returning();
    return newJob;
  } catch (error) {
    console.error('Error creating job:', error);
    throw new Error('Failed to create job');
  }
}

export async function updateJob(id: number, jobData: Partial<Omit<Job, 'id' | 'postedAt'>>) {
  try {
    const [updatedJob] = await db
      .update(job)
      .set(jobData)
      .where(eq(job.id, id))
      .returning();
    return updatedJob;
  } catch (error) {
    console.error('Error updating job:', error);
    throw new Error('Failed to update job');
  }
}

export async function deleteJob(id: number) {
  try {
    await db.delete(job).where(eq(job.id, id));
  } catch (error) {
    console.error('Error deleting job:', error);
    throw new Error('Failed to delete job');
  }
}