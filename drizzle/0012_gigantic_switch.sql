CREATE TABLE "comment_reactions" (
	"reaction_id" serial PRIMARY KEY NOT NULL,
	"comment_id" integer NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(10) NOT NULL,
	"reacted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "resource_downloads" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "resource_tags" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "resource_views" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "resource_downloads" CASCADE;--> statement-breakpoint
DROP TABLE "resource_tags" CASCADE;--> statement-breakpoint
DROP TABLE "resource_views" CASCADE;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "parent_comment_id" integer;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "views_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "downloads_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_comment_id_comments_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("comment_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_comment_reaction" ON "comment_reactions" USING btree ("comment_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_comment_reactions_comment" ON "comment_reactions" USING btree ("comment_id");--> statement-breakpoint
CREATE INDEX "idx_comments_parent" ON "comments" USING btree ("parent_comment_id");