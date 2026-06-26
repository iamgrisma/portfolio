ALTER TABLE `users` ADD COLUMN `name` text;
ALTER TABLE `users` ADD COLUMN `password` text;
ALTER TABLE `users` ADD COLUMN `image` text;

CREATE TABLE `media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`filename` text NOT NULL,
	`original_filename` text NOT NULL,
	`r2_key` text NOT NULL,
	`url` text NOT NULL,
	`alt_text` text,
	`caption` text,
	`mime_type` text NOT NULL,
	`size` integer NOT NULL,
	`folder` text NOT NULL,
	`uploaded_by` integer,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer
);

CREATE UNIQUE INDEX `media_r2_key_unique` ON `media` (`r2_key`);
