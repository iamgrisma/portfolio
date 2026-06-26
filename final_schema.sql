CREATE TABLE IF NOT EXISTS `educations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`degree` text NOT NULL,
	`institution` text NOT NULL,
	`year` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer
);
CREATE TABLE IF NOT EXISTS `experiences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`role` text NOT NULL,
	`organization` text NOT NULL,
	`duration` text NOT NULL,
	`description` text,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer
);
CREATE TABLE IF NOT EXISTS `interests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`category` text,
	`created_at` integer
);
CREATE TABLE IF NOT EXISTS `profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`nickname` text,
	`bio` text,
	`tagline` text,
	`created_at` integer,
	`updated_at` integer
, `current_address` text, `permanent_address` text, `phone` text, `public_email` text);
INSERT INTO "profiles" ("id","name","nickname","bio","tagline","created_at","updated_at","current_address","permanent_address","phone","public_email") VALUES(2,'Raksha Mishra','Raksha','I am an IT Professional based in Lalitpur, originally from Jhapa. I have extensive experience providing technical support and integration for robust web applications, particularly in government systems like the Integrated Pension Management System and CGAS. I have a diverse technical background spanning .NET, PHP, and modern web frameworks.','IT Professional',NULL,NULL,'Lalitpur, Nepal','Jhapa, Nepal','+977 9840032616','contact@raksha.com.np');
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uid TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at INTEGER DEFAULT (unixepoch())
);
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#10b981',
  created_at INTEGER DEFAULT (unixepoch())
);
CREATE TABLE IF NOT EXISTS blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  reading_time TEXT,
  published INTEGER NOT NULL DEFAULT 0,
  author_id INTEGER NOT NULL REFERENCES users(id),
  category_id INTEGER REFERENCES categories(id),
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at INTEGER DEFAULT (unixepoch())
);
CREATE TABLE IF NOT EXISTS blog_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  blog_id INTEGER NOT NULL REFERENCES blogs(id),
  tag_id INTEGER NOT NULL REFERENCES tags(id)
);
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
, `type` text DEFAULT 'contact' NOT NULL, `phone` text, `service` text, "project_type" text, `date` text, `time` text, `status` text DEFAULT 'pending' NOT NULL);
CREATE TABLE IF NOT EXISTS social_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
);
CREATE TABLE IF NOT EXISTS `stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`value` text NOT NULL,
	`icon` text DEFAULT 'Award' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL
);
CREATE TABLE IF NOT EXISTS `contact_replies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`contact_id` integer NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE IF NOT EXISTS `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`organization` text,
	`tech_stack` text,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP)
);