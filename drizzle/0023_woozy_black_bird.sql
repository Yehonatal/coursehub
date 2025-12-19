ALTER TABLE "users" ALTER COLUMN "subscription_status" SET DEFAULT 'free';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "subscription_status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_quotas" ADD COLUMN "ai_chat_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_quotas" ADD COLUMN "storage_usage" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_expiry" timestamp;