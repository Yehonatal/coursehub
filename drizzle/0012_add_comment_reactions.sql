-- Add parent_comment_id to comments and create comment_reactions table
ALTER TABLE comments
    ADD COLUMN IF NOT EXISTS parent_comment_id integer REFERENCES comments(comment_id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS comment_reactions (
    reaction_id serial PRIMARY KEY,
    comment_id integer NOT NULL REFERENCES comments(comment_id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    type varchar(10) NOT NULL,
    reacted_at timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_comment_reaction ON comment_reactions (comment_id, user_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_comment ON comment_reactions (comment_id);
*** End Patch