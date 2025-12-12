CREATE TABLE "resource_downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"resource_id" uuid NOT NULL,
	"user_id" uuid,
	"downloaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "resource_downloads" ADD CONSTRAINT "resource_downloads_resource_id_resources_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("resource_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_resource_downloads_resource" ON "resource_downloads" USING btree ("resource_id");