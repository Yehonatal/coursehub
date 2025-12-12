-- Add resource_downloads table
CREATE TABLE IF NOT EXISTS resource_downloads (
  id serial PRIMARY KEY,
  resource_id uuid NOT NULL REFERENCES resources(resource_id) ON DELETE CASCADE,
  user_id uuid,
  downloaded_at timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_resource_downloads_resource ON resource_downloads(resource_id);
