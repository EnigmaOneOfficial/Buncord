CREATE TABLE `movies` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`release_year` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text DEFAULT 'Unknown',
	`discriminator` integer DEFAULT 0,
	`avatar` text,
	`message_count` integer DEFAULT 0
);
