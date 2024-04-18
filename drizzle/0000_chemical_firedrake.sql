CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text DEFAULT 'Unknown',
	`avatar` text,
	`message_count` integer DEFAULT 0
);
