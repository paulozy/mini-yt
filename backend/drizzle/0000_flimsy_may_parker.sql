CREATE TABLE `videos_table` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`tags` text,
	`status` text NOT NULL,
	`videoFilename` text NOT NULL,
	`videoMimeType` text NOT NULL,
	`videoSize` integer NOT NULL,
	`videoManifestUrl` text,
	`thumbFilename` text NOT NULL,
	`thumbMimeType` text NOT NULL,
	`thumbSize` integer NOT NULL,
	`thumbUrl` text,
	`uploadedAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
