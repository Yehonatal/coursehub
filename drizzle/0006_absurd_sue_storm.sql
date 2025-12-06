ALTER TABLE "users" RENAME COLUMN "full_name" TO "first_name";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "university" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "school_id_url" varchar(512);