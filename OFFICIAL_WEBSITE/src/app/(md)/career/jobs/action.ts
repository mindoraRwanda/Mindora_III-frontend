'use server';

import { db } from '@/db'; 
import { job, Job } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function getJobs(): Promise<Job[]> {
  try {
    return await db.select().from(job).orderBy(desc(job.postedAt));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Failed to fetch jobs');
  }
}

