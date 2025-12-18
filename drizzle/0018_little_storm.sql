CREATE INDEX "idx_resources_course_code" ON "resources" USING btree ("course_code");--> statement-breakpoint
CREATE INDEX "idx_resources_university" ON "resources" USING btree ("university");--> statement-breakpoint
CREATE INDEX "idx_resources_title" ON "resources" USING btree ("title");