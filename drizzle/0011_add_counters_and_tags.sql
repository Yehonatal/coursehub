-- Add views_count and downloads_count columns to resources table
ALTER TABLE "resources" ADD COLUMN "views_count" integer DEFAULT 0 NOT NULL;
ALTER TABLE "resources" ADD COLUMN "downloads_count" integer DEFAULT 0 NOT NULL;
ALTER TABLE "resources" ADD COLUMN "tags" text;

-- Drop resource_tags, resource_views, and resource_downloads tables
DROP TABLE IF EXISTS "resource_tags";
DROP TABLE IF EXISTS "resource_views";
DROP TABLE IF EXISTS "resource_downloads";
