ALTER TABLE "resources" ADD COLUMN "mime_type" varchar(100);--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "file_size" integer;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "resource_type" varchar(20);