CREATE TABLE `videos_table` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`tags` text,
	`status` text NOT NULL,
	`mimeType` text NOT NULL,
	`size` integer NOT NULL,
	`uploadedAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
