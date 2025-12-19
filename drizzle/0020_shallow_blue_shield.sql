ALTER TABLE "universities" ADD COLUMN "slug" varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "location" varchar(255);--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "website" varchar(255);--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "logo_url" varchar(512);--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "is_private" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "is_official" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "universities" ADD CONSTRAINT "universities_slug_unique" UNIQUE("slug");