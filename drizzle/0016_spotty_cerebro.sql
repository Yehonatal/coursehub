ALTER TABLE "notifications" ADD COLUMN "link" varchar(512);--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "is_read" boolean DEFAULT false NOT NULL;