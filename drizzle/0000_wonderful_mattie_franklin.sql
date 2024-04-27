CREATE TABLE `item` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`store_id` text,
	`category` text,
	`snap_sbt` integer,
	`title` text
);
--> statement-breakpoint
CREATE TABLE `item_price` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_id` integer,
	`date` integer,
	`sales_rank` integer,
	`price` real,
	`unit_id` integer,
	`price_per_unit` real,
	`total_units` real,
	FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `unit` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`unit_type` text,
	`unit_display` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `item_store_id_unique` ON `item` (`store_id`);