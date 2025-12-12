-- Add metadata columns for resources: mime_type, file_size, resource_type

ALTER TABLE "resources" ADD COLUMN IF NOT EXISTS "mime_type" varchar(100);
ALTER TABLE "resources" ADD COLUMN IF NOT EXISTS "file_size" integer;
ALTER TABLE "resources" ADD COLUMN IF NOT EXISTS "resource_type" varchar(20);

-- Optional: allow nulls, we add them as nullable to avoid locking the table.
