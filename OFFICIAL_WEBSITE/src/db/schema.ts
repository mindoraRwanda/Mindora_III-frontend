import { pgTable, serial, varchar, text, timestamp, boolean, jsonb, integer, primaryKey, pgEnum } from 'drizzle-orm/pg-core';

export const team = pgTable('team', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  role: varchar('role', { length: 255 }),
  bio: text('bio'),
  description: text('description'),
  imageUrl: text('image_url'),
});

export const job = pgTable('job', {
  id: serial('id').primaryKey(), 
  title: varchar('title', { length: 255 }), 
  description: text('description'), 
  requirements: text('requirements'),
  location: varchar('location', { length: 255 }), 
  type: varchar('type', { length: 50 }),
  salary: varchar('salary', { length: 100 }),
  postedAt: timestamp('posted_at').defaultNow(), 
  isActive: boolean('is_active').default(true), 
});

export type Job = typeof job.$inferSelect;

export const service = pgTable('service', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  icon: varchar('icon', { length: 50 }), // Store icon name (e.g., "Brain", "Shield", "Heart", "Activity")
  createdAt: timestamp('created_at').defaultNow(),
  isActive: boolean('is_active').default(true),
});

export type Service = typeof service.$inferSelect;


export const successStories = pgTable('success_stories', {
  id: serial('id').primaryKey(),
  text: text('text'),
  author: varchar('author', { length: 255 }), 
  role: varchar('role', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(), 
});


export const hallOfFame = pgTable('hall_of_fame', {
  id: serial('id').primaryKey(), 
  name: varchar('name', { length: 255 }), 
  role: varchar('role', { length: 255 }),
  image: text('image'),
});

export const partners = pgTable('partners', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  image: text('image'),
});


export const articleCategoryEnum = pgEnum('article_category', [
  'Innovation', 
  'Industry Insights', 
  'Impact', 
  'Company News',
  'Research',
  'Events'
]);

export const eventTypeEnum = pgEnum('event_type', [
  'Webinar',
  'Conference',
  'Workshop',
  'Summit',
  'Meetup',
  'Virtual Event',
  'In-Person'
]);

export const article = pgTable('article', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  category: articleCategoryEnum('category').notNull(),
  isFeatured: boolean('is_featured').default(false),
  readTime: varchar('read_time', { length: 50 }), // e.g. "5 min read"
  author: varchar('author', { length: 255 }),
  authorImageUrl: text('author_image_url'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  isPublished: boolean('is_published').default(false),
});

export type Article = typeof article.$inferSelect;

export const tag = pgTable('tag', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
});

export const articleToTag = pgTable('article_to_tag', {
  articleId: integer('article_id').notNull().references(() => article.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').notNull().references(() => tag.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey({ columns: [t.articleId, t.tagId] })
}));

export const event = pgTable('event', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  content: text('content'),
  imageUrl: text('image_url'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  eventType: eventTypeEnum('event_type').notNull(),
  location: varchar('location', { length: 255 }),
  venue: varchar('venue', { length: 255 }),
  isVirtual: boolean('is_virtual').default(false),
  registrationUrl: text('registration_url'),
  speakers: jsonb('speakers'), // Array of speakers with names, titles, bios
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  isPublished: boolean('is_published').default(false),
});

export const subscriber = pgTable('subscriber', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  subscriptionDate: timestamp('subscription_date').defaultNow(),
  isActive: boolean('is_active').default(true),
  preferences: jsonb('preferences'), // Could store content preferences
});

export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).notNull(), // image, video, document, etc.
  url: text('url').notNull(),
  articleId: integer('article_id').references(() => article.id, { onDelete: 'set null' }),
  eventId: integer('event_id').references(() => event.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const comment = pgTable('comment', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').notNull().references(() => article.id, { onDelete: 'cascade' }),
  authorName: varchar('author_name', { length: 255 }).notNull(),
  authorEmail: varchar('author_email', { length: 255 }).notNull(),
  content: text('content').notNull(),
  isApproved: boolean('is_approved').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Backs both public lead-capture forms: the Contact page ("contact") and
// the Request-a-Demo page ("demo"). Previously neither form persisted
// anything - Contact had no submit handler at all, and Demo faked a delay
// then showed a success alert - so every real inquiry was silently lost.
export const contactMessageSourceEnum = pgEnum('contact_message_source', [
  'contact',
  'demo',
]);

export const contactMessage = pgTable('contact_message', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  organization: varchar('organization', { length: 255 }),
  // Nullable: required on the Contact form, explicitly optional on the
  // Request-a-Demo form ("Additional Message (Optional)").
  message: text('message'),
  source: contactMessageSourceEnum('source').notNull().default('contact'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export type ContactMessage = typeof contactMessage.$inferSelect;

export const analytics = pgTable('analytics', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').references(() => article.id, { onDelete: 'set null' }),
  eventId: integer('event_id').references(() => event.id, { onDelete: 'set null' }),
  views: integer('views').default(0),
  shares: integer('shares').default(0),
  likes: integer('likes').default(0),
  registrations: integer('registrations').default(0), // For events
  updatedAt: timestamp('updated_at').defaultNow(),
});