import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ===== USERS =====
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  role: text('role').notNull().default('user'), // 'admin' or 'user'
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ===== CATEGORIES =====
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  color: text('color').notNull().default('#10b981'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ===== BLOGS =====
export const blogs = sqliteTable('blogs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  featuredImage: text('featured_image'),
  readingTime: text('reading_time'),
  published: integer('published', { mode: 'boolean' }).notNull().default(false),
  authorId: integer('author_id').notNull().references(() => users.id),
  categoryId: integer('category_id').references(() => categories.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ===== TAGS =====
export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ===== BLOG TAGS (junction) =====
export const blogTags = sqliteTable('blog_tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  blogId: integer('blog_id').notNull().references(() => blogs.id),
  tagId: integer('tag_id').notNull().references(() => tags.id),
});

// ===== CONTACTS =====
export const contacts = sqliteTable('contacts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  read: integer('read', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ===== SOCIAL PROFILES =====
export const socialProfiles = sqliteTable('social_profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  platform: text('platform').notNull(),
  url: text('url').notNull(),
  icon: text('icon').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ===== PROFILES =====
export const profiles = sqliteTable('profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  nickname: text('nickname'),
  bio: text('bio'),
  tagline: text('tagline'),
  currentAddress: text('current_address'),
  permanentAddress: text('permanent_address'),
  phone: text('phone'),
  publicEmail: text('public_email'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ===== STATS =====
export const stats = sqliteTable('stats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  label: text('label').notNull(), // e.g. "Animals Treated"
  value: text('value').notNull(), // e.g. "1000+"
  icon: text('icon').notNull().default('Award'), // e.g. "Heart", "Users"
  order: integer('order').notNull().default(0),
});

// ===== EDUCATIONS =====
export const educations = sqliteTable('educations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  degree: text('degree').notNull(),
  institution: text('institution').notNull(),
  year: text('year').notNull(), // e.g. "2012 AD / 2069 BS"
  order: integer('order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ===== EXPERIENCES =====
export const experiences = sqliteTable('experiences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  role: text('role').notNull(),
  organization: text('organization').notNull(),
  duration: text('duration').notNull(), // e.g. "2078-2080 BS" or "2021-2023 AD"
  description: text('description'),
  order: integer('order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ===== INTERESTS =====
export const interests = sqliteTable('interests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  category: text('category'), // e.g., 'Literature', 'Music'
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ===== RELATIONS =====
export const usersRelations = relations(users, ({ many }) => ({
  blogs: many(blogs),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  blogs: many(blogs),
}));

export const blogsRelations = relations(blogs, ({ one, many }) => ({
  author: one(users, {
    fields: [blogs.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [blogs.categoryId],
    references: [categories.id],
  }),
  blogTags: many(blogTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  blogTags: many(blogTags),
}));

export const blogTagsRelations = relations(blogTags, ({ one }) => ({
  blog: one(blogs, {
    fields: [blogTags.blogId],
    references: [blogs.id],
  }),
  tag: one(tags, {
    fields: [blogTags.tagId],
    references: [tags.id],
  }),
}));
