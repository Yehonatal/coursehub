ALTER TABLE "report_flags" DROP CONSTRAINT "report_flags_reporter_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "verification" DROP CONSTRAINT "verification_educator_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "report_flags" ADD CONSTRAINT "report_flags_reporter_id_users_user_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification" ADD CONSTRAINT "verification_educator_id_users_user_id_fk" FOREIGN KEY ("educator_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;