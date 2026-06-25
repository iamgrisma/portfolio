CREATE TABLE `stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`value` text NOT NULL,
	`icon` text DEFAULT 'Award' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE `profiles` ADD `current_address` text;--> statement-breakpoint
ALTER TABLE `profiles` ADD `permanent_address` text;--> statement-breakpoint
ALTER TABLE `profiles` ADD `phone` text;--> statement-breakpoint
ALTER TABLE `profiles` ADD `public_email` text;