CREATE INDEX "idx_ai_requests_resource" ON "ai_requests" USING btree ("resource_id");--> statement-breakpoint
CREATE INDEX "idx_ai_requests_user" ON "ai_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_comments_resource" ON "comments" USING btree ("resource_id");--> statement-breakpoint
CREATE INDEX "idx_comments_user" ON "comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_courses_program" ON "courses" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "idx_notifications_user" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_programs_university" ON "programs" USING btree ("university_id");--> statement-breakpoint
CREATE INDEX "idx_report_flags_resource" ON "report_flags" USING btree ("resource_id");--> statement-breakpoint
CREATE INDEX "idx_report_flags_reporter" ON "report_flags" USING btree ("reporter_id");--> statement-breakpoint
CREATE INDEX "idx_resource_tags_resource" ON "resource_tags" USING btree ("resource_id");--> statement-breakpoint
CREATE INDEX "idx_resource_views_resource" ON "resource_views" USING btree ("resource_id");--> statement-breakpoint
CREATE INDEX "idx_verification_educator" ON "verification" USING btree ("educator_id");