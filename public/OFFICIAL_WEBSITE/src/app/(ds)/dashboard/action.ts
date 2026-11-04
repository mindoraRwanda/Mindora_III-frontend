'use server';

import { db } from '@/db';
import { job, article, event, analytics } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Types for dashboard data
interface DashboardStats {
  totalJobs: number;
  totalArticles: number;
  totalEvents: number;
  totalViews: number;
  totalRegistrations: number;
}

interface JobData {
  id?: number;
  title: string;
  description: string;
  requirements?: string;
  location?: string;
  type?: string;
  salary?: string;
  isActive?: boolean;
}

interface ArticleData {
  id?: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  category: 'Innovation' | 'Industry Insights' | 'Impact' | 'Company News' | 'Research' | 'Events';
  isPublished?: boolean;
}

interface EventData {
  id?: number;
  title: string;
  slug: string;
  description: string;
  startDate: Date;
  eventType: 'Webinar' | 'Conference' | 'Workshop' | 'Summit' | 'Meetup' | 'Virtual Event' | 'In-Person';
  isPublished?: boolean;
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [jobs, articles, events, analyticsData] = await Promise.all([
      db.select().from(job),
      db.select().from(article),
      db.select().from(event),
      db.select().from(analytics),
    ]);

    const totalViews = analyticsData.reduce((sum, a) => sum + (a.views || 0), 0);
    const totalRegistrations = analyticsData.reduce((sum, a) => sum + (a.registrations || 0), 0);

    return {
      totalJobs: jobs.length,
      totalArticles: articles.length,
      totalEvents: events.length,
      totalViews,
      totalRegistrations,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
}

// Job Actions
export async function createJob(data: JobData) {
  try {
    if (!data.title || !data.description) {
      throw new Error('Missing required fields: title or description');
    }

    const newJob = await db.insert(job).values({
      title: data.title,
      description: data.description,
      requirements: data.requirements || null,
      location: data.location || null,
      type: data.type || null,
      salary: data.salary || null,
      isActive: data.isActive ?? true,
    }).returning();

    return newJob[0];
  } catch (error) {
    console.error('Error creating job:', error);
    throw new Error('Failed to create job');
  }
}

export async function updateJob(id: number, data: JobData) {
  try {
    if (!data.title || !data.description) {
      throw new Error('Missing required fields: title or description');
    }

    const updatedJob = await db.update(job)
      .set({
        title: data.title,
        description: data.description,
        requirements: data.requirements || null,
        location: data.location || null,
        type: data.type || null,
        salary: data.salary || null,
        isActive: data.isActive ?? true,
      })
      .where(eq(job.id, id))
      .returning();

    if (!updatedJob.length) {
      throw new Error('Job not found');
    }

    return updatedJob[0];
  } catch (error) {
    console.error('Error updating job:', error);
    throw new Error('Failed to update job');
  }
}

export async function deleteJob(id: number) {
  try {
    const deletedJob = await db.delete(job)
      .where(eq(job.id, id))
      .returning();

    if (!deletedJob.length) {
      throw new Error('Job not found');
    }

    return deletedJob[0];
  } catch (error) {
    console.error('Error deleting job:', error);
    throw new Error('Failed to delete job');
  }
}

// Article Actions
export async function createArticle(data: ArticleData) {
  try {
    if (!data.title || !data.slug || !data.description || !data.content || !data.imageUrl || !data.category) {
      throw new Error('Missing required fields');
    }

    const newArticle = await db.insert(article).values({
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content,
      imageUrl: data.imageUrl,
      category: data.category,
      isPublished: data.isPublished ?? false,
    }).returning();

    return newArticle[0];
  } catch (error) {
    console.error('Error creating article:', error);
    throw new Error('Failed to create article');
  }
}

export async function updateArticle(id: number, data: ArticleData) {
  try {
    if (!data.title || !data.slug || !data.description || !data.content || !data.imageUrl || !data.category) {
      throw new Error('Missing required fields');
    }

    const updatedArticle = await db.update(article)
      .set({
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content,
        imageUrl: data.imageUrl,
        category: data.category,
        isPublished: data.isPublished ?? false,
      })
      .where(eq(article.id, id))
      .returning();

    if (!updatedArticle.length) {
      throw new Error('Article not found');
    }

    return updatedArticle[0];
  } catch (error) {
    console.error('Error updating article:', error);
    throw new Error('Failed to update article');
  }
}

export async function deleteArticle(id: number) {
  try {
    const deletedArticle = await db.delete(article)
      .where(eq(article.id, id))
      .returning();

    if (!deletedArticle.length) {
      throw new Error('Article not found');
    }

    return deletedArticle[0];
  } catch (error) {
    console.error('Error deleting article:', error);
    throw new Error('Failed to delete article');
  }
}

// Event Actions
export async function createEvent(data: EventData) {
  try {
    if (!data.title || !data.slug || !data.description || !data.startDate || !data.eventType) {
      throw new Error('Missing required fields');
    }

    const newEvent = await db.insert(event).values({
      title: data.title,
      slug: data.slug,
      description: data.description,
      startDate: data.startDate,
      eventType: data.eventType,
      isPublished: data.isPublished ?? false,
    }).returning();

    return newEvent[0];
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error('Failed to create event');
  }
}

export async function updateEvent(id: number, data: EventData) {
  try {
    if (!data.title || !data.slug || !data.description || !data.startDate || !data.eventType) {
      throw new Error('Missing required fields');
    }

    const updatedEvent = await db.update(event)
      .set({
        title: data.title,
        slug: data.slug,
        description: data.description,
        startDate: data.startDate,
        eventType: data.eventType,
        isPublished: data.isPublished ?? false,
      })
      .where(eq(event.id, id))
      .returning();

    if (!updatedEvent.length) {
      throw new Error('Event not found');
    }

    return updatedEvent[0];
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error('Failed to update event');
  }
}

export async function deleteEvent(id: number) {
  try {
    const deletedEvent = await db.delete(event)
      .where(eq(event.id, id))
      .returning();

    if (!deletedEvent.length) {
      throw new Error('Event not found');
    }

    return deletedEvent[0];
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
}