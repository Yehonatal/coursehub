CREATE TABLE "courses" (
	"course_id" serial PRIMARY KEY NOT NULL,
	"program_id" integer NOT NULL,
	"course_code" varchar(10) NOT NULL,
	"course_name" varchar(255) NOT NULL,
	"semester" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"program_id" serial PRIMARY KEY NOT NULL,
	"university_id" integer NOT NULL,
	"program_name" varchar(120) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report_flags" (
	"report_id" serial PRIMARY KEY NOT NULL,
	"resource_id" uuid NOT NULL,
	"reporter_id" uuid NOT NULL,
	"reason" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'Pending' NOT NULL,
	"reported_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resource_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"resource_id" uuid NOT NULL,
	"tag" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resource_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"resource_id" uuid NOT NULL,
	"user_id" uuid,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_resources" (
	"saved_id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"resource_id" uuid NOT NULL,
	"saved_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "universities" (
	"university_id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	CONSTRAINT "universities_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_program_id_programs_program_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("program_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programs" ADD CONSTRAINT "programs_university_id_universities_university_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("university_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_flags" ADD CONSTRAINT "report_flags_resource_id_resources_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("resource_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_flags" ADD CONSTRAINT "report_flags_reporter_id_users_user_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_tags" ADD CONSTRAINT "resource_tags_resource_id_resources_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("resource_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_views" ADD CONSTRAINT "resource_views_resource_id_resources_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("resource_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_resources" ADD CONSTRAINT "saved_resources_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_resources" ADD CONSTRAINT "saved_resources_resource_id_resources_resource_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("resource_id") ON DELETE no action ON UPDATE no action;