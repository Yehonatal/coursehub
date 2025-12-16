CREATE TABLE "user_quotas" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"ai_generations_count" integer DEFAULT 0 NOT NULL,
	"last_reset_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_quotas" ADD CONSTRAINT "user_quotas_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;