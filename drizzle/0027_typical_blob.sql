ALTER TABLE "resources" ADD COLUMN "storage_path" varchar(512);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "school_id_path" varchar(512);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_image_path" varchar(512);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "banner_path" varchar(512);