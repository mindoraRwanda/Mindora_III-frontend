// app/news-events/actions.ts
'use server';

import { db } from '@/db';
import { article, event, tag, articleToTag, subscriber, media, articleCategoryEnum, eventTypeEnum } from '@/db/schema';
import { eq, desc, and, inArray, sql } from 'drizzle-orm';

// Article Types
export type ArticleCategory = (typeof articleCategoryEnum.enumValues)[number];
export type EventType = (typeof eventTypeEnum.enumValues)[number];

export interface ArticleData {
  id?: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  thumbnailUrl?: string | null;
  category: ArticleCategory;
  isFeatured?: boolean | null;
  readTime?: string | null;
  author?: string | null;
  authorImageUrl?: string | null;
  publishedAt?: Date | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isPublished?: boolean | null;
  tags?: number[] | TagData[];
}

// Event Types
export interface EventData {
  id?: number;
  title: string;
  slug: string;
  description: string;
  content?: string | null;
  imageUrl?: string | null;
  startDate: Date;
  endDate?: Date | null;
  eventType: EventType;
  location?: string | null;
  venue?: string | null;
  isVirtual?: boolean | null;
  registrationUrl?: string | null;
  speakers?: unknown;
  isFeatured?: boolean | null;
  isPublished?: boolean | null;
}

// Tag Types
export interface TagData {
  id?: number;
  name: string;
  slug: string;
}

// Media Types
export interface MediaData {
  id?: number;
  title: string;
  description?: string | null;
  type: string;
  url: string;
  articleId?: number | null;
  eventId?: number | null;
}

// Subscriber Types
export interface SubscriberData {
  id?: number;
  email: string;
  name?: string | null;
  isActive?: boolean | null;
  preferences?: unknown;
}

// =================== ARTICLE ACTIONS ===================

// Get all articles with optional filters
export async function getArticles({ 
  category = null, 
  featured = null, 
  published = null,
  limit = 100,
  offset = 0,
  search = '',
  tagIds = []
}: {
  category?: ArticleCategory | null,
  featured?: boolean | null,
  published?: boolean | null,
  limit?: number,
  offset?: number,
  search?: string,
  tagIds?: number[]
} = {}) {
  try {
    let query = db.select().from(article).orderBy(desc(article.publishedAt)).$dynamic();

    // Apply filters if provided
    const conditions = [];
    if (category) conditions.push(eq(article.category, category));
    if (featured !== null) conditions.push(eq(article.isFeatured, featured));
    if (published !== null) conditions.push(eq(article.isPublished, published));
    if (search) {
      conditions.push(
        sql`(${article.title} ILIKE ${`%${search}%`} OR ${article.description} ILIKE ${`%${search}%`})`
      );
    }

    // Apply all conditions if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply tag filtering if provided
    if (tagIds.length > 0) {
      const articlesWithTags = db.select({ articleId: articleToTag.articleId })
        .from(articleToTag)
        .where(inArray(articleToTag.tagId, tagIds))
        .as('articlesWithTags');
      
      query = query.where(inArray(article.id, db.select({ articleId: articlesWithTags.articleId }).from(articlesWithTags)));
    }
    
    // Apply pagination
    query = query.limit(limit).offset(offset);
    
    const articles = await query;
    
    // Get tags for each article
    const articlesWithTags = await Promise.all(articles.map(async (art) => {
      const tagRelations = await db.select({
        tag: tag
      })
      .from(articleToTag)
      .innerJoin(tag, eq(tag.id, articleToTag.tagId))
      .where(eq(articleToTag.articleId, art.id));
      
      return {
        ...art,
        tags: tagRelations.map(t => t.tag)
      };
    }));
    
    return articlesWithTags;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw new Error('Failed to fetch articles');
  }
}

// Get a single article by ID
export async function getArticleById(id: number) {
  try {
    const [articleData] = await db.select().from(article).where(eq(article.id, id));
    
    if (!articleData) {
      throw new Error('Article not found');
    }
    
    // Get tags for the article
    const tagRelations = await db.select({
      tag: tag
    })
    .from(articleToTag)
    .innerJoin(tag, eq(tag.id, articleToTag.tagId))
    .where(eq(articleToTag.articleId, id));
    
    return {
      ...articleData,
      tags: tagRelations.map(t => t.tag)
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    throw new Error('Failed to fetch article');
  }
}

// Get article by slug
export async function getArticleBySlug(slug: string) {
  try {
    const [articleData] = await db.select().from(article).where(eq(article.slug, slug));
    
    if (!articleData) {
      throw new Error('Article not found');
    }
    
    // Get tags for the article
    const tagRelations = await db.select({
      tag: tag
    })
    .from(articleToTag)
    .innerJoin(tag, eq(tag.id, articleToTag.tagId))
    .where(eq(articleToTag.articleId, articleData.id));
    
    return {
      ...articleData,
      tags: tagRelations.map(t => t.tag)
    };
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    throw new Error('Failed to fetch article');
  }
}

// Create a new article
export async function createArticle(data: ArticleData) {
  try {
    // Validate required fields
    if (!data.title || !data.slug || !data.description || !data.content || !data.imageUrl || !data.category) {
      throw new Error('Missing required fields');
    }
    
    // Check if slug is unique
    const existingArticle = await db.select({ id: article.id }).from(article).where(eq(article.slug, data.slug));
    if (existingArticle.length > 0) {
      throw new Error('Slug must be unique');
    }
    
    // Create article
    const [newArticle] = await db.insert(article).values({
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content,
      imageUrl: data.imageUrl,
      thumbnailUrl: data.thumbnailUrl || null,
      category: data.category,
      isFeatured: data.isFeatured || false,
      readTime: data.readTime || null,
      author: data.author || null,
      authorImageUrl: data.authorImageUrl || null,
      publishedAt: data.isPublished ? new Date() : null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      isPublished: data.isPublished || false,
    }).returning();
    
    // Add tags if provided
    if (data.tags && data.tags.length > 0) {
      await Promise.all(data.tags.map(t =>
        db.insert(articleToTag).values({
          articleId: newArticle.id,
          tagId: typeof t === 'number' ? t : t.id!
        })
      ));
    }
    
    return newArticle;
  } catch (error) {
    console.error('Error creating article:', error);
    throw new Error(`Failed to create article: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Update an existing article
export async function updateArticle(id: number, data: ArticleData) {
  try {
    // Validate required fields
    if (!data.title || !data.slug || !data.description || !data.content || !data.imageUrl || !data.category) {
      throw new Error('Missing required fields');
    }
    
    // Check if slug is unique (excluding this article)
    const existingArticle = await db.select({ id: article.id }).from(article).where(
      and(eq(article.slug, data.slug), sql`${article.id} != ${id}`)
    );
    
    if (existingArticle.length > 0) {
      throw new Error('Slug must be unique');
    }
    
    // Create timestamp for publishing if not already published
    const publishedAt = data.isPublished 
      ? await db.select({ publishedAt: article.publishedAt }).from(article).where(eq(article.id, id)).then(res => res[0]?.publishedAt || new Date())
      : null;
    
    // Update article
    const [updatedArticle] = await db.update(article)
      .set({
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content,
        imageUrl: data.imageUrl,
        thumbnailUrl: data.thumbnailUrl || null,
        category: data.category,
        isFeatured: data.isFeatured || false,
        readTime: data.readTime || null,
        author: data.author || null,
        authorImageUrl: data.authorImageUrl || null,
        publishedAt: data.isPublished ? publishedAt : null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        isPublished: data.isPublished || false,
        updatedAt: new Date(),
      })
      .where(eq(article.id, id))
      .returning();
    
    if (!updatedArticle) {
      throw new Error('Article not found');
    }
    
    // Update tags if provided
    if (data.tags) {
      // Remove existing tags
      await db.delete(articleToTag).where(eq(articleToTag.articleId, id));
      
      // Add new tags
      if (data.tags.length > 0) {
        await Promise.all(data.tags.map(t =>
          db.insert(articleToTag).values({
            articleId: id,
            tagId: typeof t === 'number' ? t : t.id!
          })
        ));
      }
    }
    
    return updatedArticle;
  } catch (error) {
    console.error('Error updating article:', error);
    throw new Error(`Failed to update article: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Delete an article
export async function deleteArticle(id: number) {
  try {
    // Delete tags relationships first (cascade delete should handle this, but being explicit)
    await db.delete(articleToTag).where(eq(articleToTag.articleId, id));
    
    // Delete article
    const [deletedArticle] = await db.delete(article)
      .where(eq(article.id, id))
      .returning();
    
    if (!deletedArticle) {
      throw new Error('Article not found');
    }
    
    return deletedArticle;
  } catch (error) {
    console.error('Error deleting article:', error);
    throw new Error('Failed to delete article');
  }
}

// Toggle article featured status
export async function toggleArticleFeatured(id: number, isFeatured: boolean) {
  try {
    const [updatedArticle] = await db.update(article)
      .set({ isFeatured })
      .where(eq(article.id, id))
      .returning();
    
    if (!updatedArticle) {
      throw new Error('Article not found');
    }
    
    return updatedArticle;
  } catch (error) {
    console.error('Error toggling article featured status:', error);
    throw new Error('Failed to update article');
  }
}

// Toggle article published status
export async function toggleArticlePublished(id: number, isPublished: boolean) {
  try {
    const [updatedArticle] = await db.update(article)
      .set({ 
        isPublished,
        publishedAt: isPublished ? new Date() : null
      })
      .where(eq(article.id, id))
      .returning();
    
    if (!updatedArticle) {
      throw new Error('Article not found');
    }
    
    return updatedArticle;
  } catch (error) {
    console.error('Error toggling article published status:', error);
    throw new Error('Failed to update article');
  }
}

// =================== EVENT ACTIONS ===================

// Get all events with optional filters
export async function getEvents({ 
  eventType = null, 
  featured = null, 
  published = null,
  future = null,
  past = null,
  limit = 100,
  offset = 0,
  search = ''
}: {
  eventType?: EventType | null,
  featured?: boolean | null,
  published?: boolean | null,
  future?: boolean | null,
  past?: boolean | null,
  limit?: number,
  offset?: number,
  search?: string
} = {}) {
  try {
    let query = db.select().from(event).orderBy(desc(event.startDate)).$dynamic();
    
    // Apply filters if provided
    const conditions = [];
    if (eventType) conditions.push(eq(event.eventType, eventType));
    if (featured !== null) conditions.push(eq(event.isFeatured, featured));
    if (published !== null) conditions.push(eq(event.isPublished, published));
    
    // Filter for future events
    if (future === true) {
      conditions.push(sql`${event.startDate} > NOW()`);
    }
    
    // Filter for past events
    if (past === true) {
      conditions.push(sql`${event.startDate} < NOW()`);
    }
    
    if (search) {
      conditions.push(
        sql`(${event.title} ILIKE ${`%${search}%`} OR ${event.description} ILIKE ${`%${search}%`})`
      );
    }
    
    // Apply all conditions if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply pagination
    query = query.limit(limit).offset(offset);
    
    const events = await query;
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }
}

// Get a single event by ID
export async function getEventById(id: number) {
  try {
    const [eventData] = await db.select().from(event).where(eq(event.id, id));
    
    if (!eventData) {
      throw new Error('Event not found');
    }
    
    return eventData;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw new Error('Failed to fetch event');
  }
}

// Get event by slug
export async function getEventBySlug(slug: string) {
  try {
    const [eventData] = await db.select().from(event).where(eq(event.slug, slug));
    
    if (!eventData) {
      throw new Error('Event not found');
    }
    
    return eventData;
  } catch (error) {
    console.error('Error fetching event by slug:', error);
    throw new Error('Failed to fetch event');
  }
}

// Create a new event
export async function createEvent(data: EventData) {
  try {
    // Validate required fields
    if (!data.title || !data.slug || !data.description || !data.startDate || !data.eventType) {
      throw new Error('Missing required fields');
    }
    
    // Check if slug is unique
    const existingEvent = await db.select({ id: event.id }).from(event).where(eq(event.slug, data.slug));
    if (existingEvent.length > 0) {
      throw new Error('Slug must be unique');
    }
    
    // Create event
    const [newEvent] = await db.insert(event).values({
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content || null,
      imageUrl: data.imageUrl || null,
      startDate: data.startDate,
      endDate: data.endDate || null,
      eventType: data.eventType,
      location: data.location || null,
      venue: data.venue || null,
      isVirtual: data.isVirtual || false,
      registrationUrl: data.registrationUrl || null,
      speakers: data.speakers || null,
      isFeatured: data.isFeatured || false,
      isPublished: data.isPublished || false,
    }).returning();
    
    return newEvent;
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Update an existing event
export async function updateEvent(id: number, data: EventData) {
  try {
    // Validate required fields
    if (!data.title || !data.slug || !data.description || !data.startDate || !data.eventType) {
      throw new Error('Missing required fields');
    }
    
    // Check if slug is unique (excluding this event)
    const existingEvent = await db.select({ id: event.id }).from(event).where(
      and(eq(event.slug, data.slug), sql`${event.id} != ${id}`)
    );
    
    if (existingEvent.length > 0) {
      throw new Error('Slug must be unique');
    }
    
    // Update event
    const [updatedEvent] = await db.update(event)
      .set({
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content || null,
        imageUrl: data.imageUrl || null,
        startDate: data.startDate,
        endDate: data.endDate || null,
        eventType: data.eventType,
        location: data.location || null,
        venue: data.venue || null,
        isVirtual: data.isVirtual || false,
        registrationUrl: data.registrationUrl || null,
        speakers: data.speakers || null,
        isFeatured: data.isFeatured || false,
        isPublished: data.isPublished || false,
        updatedAt: new Date(),
      })
      .where(eq(event.id, id))
      .returning();
    
    if (!updatedEvent) {
      throw new Error('Event not found');
    }
    
    return updatedEvent;
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error(`Failed to update event: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Delete an event
export async function deleteEvent(id: number) {
  try {
    const [deletedEvent] = await db.delete(event)
      .where(eq(event.id, id))
      .returning();
    
    if (!deletedEvent) {
      throw new Error('Event not found');
    }
    
    return deletedEvent;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
}

// Toggle event featured status
export async function toggleEventFeatured(id: number, isFeatured: boolean) {
  try {
    const [updatedEvent] = await db.update(event)
      .set({ isFeatured })
      .where(eq(event.id, id))
      .returning();
    
    if (!updatedEvent) {
      throw new Error('Event not found');
    }
    
    return updatedEvent;
  } catch (error) {
    console.error('Error toggling event featured status:', error);
    throw new Error('Failed to update event');
  }
}

// Toggle event published status
export async function toggleEventPublished(id: number, isPublished: boolean) {
  try {
    const [updatedEvent] = await db.update(event)
      .set({ isPublished })
      .where(eq(event.id, id))
      .returning();
    
    if (!updatedEvent) {
      throw new Error('Event not found');
    }
    
    return updatedEvent;
  } catch (error) {
    console.error('Error toggling event published status:', error);
    throw new Error('Failed to update event');
  }
}

// =================== TAG ACTIONS ===================

// Get all tags
export async function getTags() {
  try {
    return await db.select().from(tag).orderBy(tag.name);
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw new Error('Failed to fetch tags');
  }
}

// Create a new tag
export async function createTag(data: TagData) {
  try {
    if (!data.name || !data.slug) {
      throw new Error('Name and slug are required');
    }
    
    // Check if slug is unique
    const existingTag = await db.select({ id: tag.id }).from(tag).where(eq(tag.slug, data.slug));
    if (existingTag.length > 0) {
      throw new Error('Slug must be unique');
    }
    
    const [newTag] = await db.insert(tag).values({
      name: data.name,
      slug: data.slug
    }).returning();
    
    return newTag;
  } catch (error) {
    console.error('Error creating tag:', error);
    throw new Error(`Failed to create tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Update a tag
export async function updateTag(id: number, data: TagData) {
  try {
    if (!data.name || !data.slug) {
      throw new Error('Name and slug are required');
    }
    
    // Check if slug is unique (excluding this tag)
    const existingTag = await db.select({ id: tag.id }).from(tag).where(
      and(eq(tag.slug, data.slug), sql`${tag.id} != ${id}`)
    );
    
    if (existingTag.length > 0) {
      throw new Error('Slug must be unique');
    }
    
    const [updatedTag] = await db.update(tag)
      .set({
        name: data.name,
        slug: data.slug
      })
      .where(eq(tag.id, id))
      .returning();
    
    if (!updatedTag) {
      throw new Error('Tag not found');
    }
    
    return updatedTag;
  } catch (error) {
    console.error('Error updating tag:', error);
    throw new Error(`Failed to update tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Delete a tag
export async function deleteTag(id: number) {
  try {
    // Remove tag relationships first
    await db.delete(articleToTag).where(eq(articleToTag.tagId, id));
    
    const [deletedTag] = await db.delete(tag)
      .where(eq(tag.id, id))
      .returning();
    
    if (!deletedTag) {
      throw new Error('Tag not found');
    }
    
    return deletedTag;
  } catch (error) {
    console.error('Error deleting tag:', error);
    throw new Error('Failed to delete tag');
  }
}

// =================== SUBSCRIBER ACTIONS ===================

// Get all subscribers
export async function getSubscribers({ 
  active = null,
  limit = 100,
  offset = 0,
  search = ''
}: {
  active?: boolean | null,
  limit?: number,
  offset?: number,
  search?: string
} = {}) {
  try {
    let query = db.select().from(subscriber).orderBy(desc(subscriber.subscriptionDate)).$dynamic();
    
    // Apply filters
    const conditions = [];
    if (active !== null) conditions.push(eq(subscriber.isActive, active));
    if (search) {
      conditions.push(
        sql`(${subscriber.email} ILIKE ${`%${search}%`} OR ${subscriber.name} ILIKE ${`%${search}%`})`
      );
    }
    
    // Apply all conditions if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply pagination
    query = query.limit(limit).offset(offset);
    
    return await query;
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    throw new Error('Failed to fetch subscribers');
  }
}

// Create a new subscriber
export async function createSubscriber(data: SubscriberData) {
  try {
    if (!data.email) {
      throw new Error('Email is required');
    }
    
    // Check if email already exists
    const existingSubscriber = await db.select({ id: subscriber.id }).from(subscriber).where(eq(subscriber.email, data.email));
    if (existingSubscriber.length > 0) {
      throw new Error('Email already subscribed');
    }
    
    const [newSubscriber] = await db.insert(subscriber).values({
      email: data.email,
      name: data.name || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      preferences: data.preferences || null
    }).returning();
    
    return newSubscriber;
  } catch (error) {
    console.error('Error creating subscriber:', error);
    throw new Error(`Failed to create subscriber: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Update a subscriber
export async function updateSubscriber(id: number, data: SubscriberData) {
  try {
    if (!data.email) {
      throw new Error('Email is required');
    }
    
    // Check if email already exists (excluding this subscriber)
    const existingSubscriber = await db.select({ id: subscriber.id }).from(subscriber).where(
      and(eq(subscriber.email, data.email), sql`${subscriber.id} != ${id}`)
    );
    
    if (existingSubscriber.length > 0) {
      throw new Error('Email already subscribed');
    }
    
    const [updatedSubscriber] = await db.update(subscriber)
      .set({
        email: data.email,
        name: data.name || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        preferences: data.preferences || null
      })
      .where(eq(subscriber.id, id))
      .returning();
    
    if (!updatedSubscriber) {
      throw new Error('Subscriber not found');
    }
    
    return updatedSubscriber;
  } catch (error) {
    console.error('Error updating subscriber:', error);
    throw new Error(`Failed to update subscriber: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Delete a subscriber
export async function deleteSubscriber(id: number) {
  try {
    const [deletedSubscriber] = await db.delete(subscriber)
      .where(eq(subscriber.id, id))
      .returning();
    
    if (!deletedSubscriber) {
      throw new Error('Subscriber not found');
    }
    
    return deletedSubscriber;
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    throw new Error('Failed to delete subscriber');
  }
}

// =================== MEDIA ACTIONS ===================

// Get all media items
export async function getMediaItems({ 
  type = null,
  articleId = null,
  eventId = null,
  limit = 100,
  offset = 0
}: {
  type?: string | null,
  articleId?: number | null,
  eventId?: number | null,
  limit?: number,
  offset?: number
} = {}) {
  try {
    let query = db.select().from(media).orderBy(desc(media.createdAt)).$dynamic();
    
    // Apply filters
    const conditions = [];
    if (type) conditions.push(eq(media.type, type));
    if (articleId !== null) conditions.push(eq(media.articleId, articleId));
    if (eventId !== null) conditions.push(eq(media.eventId, eventId));
    
    // Apply all conditions if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply pagination
    query = query.limit(limit).offset(offset);
    
    return await query;
  } catch (error) {
    console.error('Error fetching media items:', error);
    throw new Error('Failed to fetch media items');
  }
}

// Create a new media item
export async function createMediaItem(data: MediaData) {
  try {
    if (!data.title || !data.type || !data.url) {
      throw new Error('Title, type, and URL are required');
    }
    
    const [newMedia] = await db.insert(media).values({
      title: data.title,
      description: data.description || null,
      type: data.type,
      url: data.url,
      articleId: data.articleId || null,
      eventId: data.eventId || null
    }).returning();
    
    return newMedia;
  } catch (error) {
    console.error('Error creating media item:', error);
    throw new Error('Failed to create media item');
  }
}

// Update a media item
export async function updateMediaItem(id: number, data: MediaData) {
  try {
    if (!data.title || !data.type || !data.url) {
      throw new Error('Title, type, and URL are required');
    }
    
    const [updatedMedia] = await db.update(media)
      .set({
        title: data.title,
        description: data.description || null,
        type: data.type,
        url: data.url,
        articleId: data.articleId || null,
        eventId: data.eventId || null
      })
      .where(eq(media.id, id))
      .returning();
    
    if (!updatedMedia) {
      throw new Error('Media item not found');
    }
    
    return updatedMedia;
  } catch (error) {
    console.error('Error updating media item:', error);
    throw new Error('Failed to update media item');
  }
}

// Delete a media item
export async function deleteMediaItem(id: number) {
  try {
    const [deletedMedia] = await db.delete(media)
      .where(eq(media.id, id))
      .returning();
    
    if (!deletedMedia) {
      throw new Error('Media item not found');
    }
    
    return deletedMedia;
  } catch (error) {
    console.error('Error deleting media item:', error);
    throw new Error('Failed to delete media item');
  }
}