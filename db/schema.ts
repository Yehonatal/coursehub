import {
    pgTable,
    uuid,
    varchar,
    text,
    boolean,
    timestamp,
    integer,
    serial,
} from "drizzle-orm/pg-core";

// ================= USERS =================
export const users = pgTable("users", {
    user_id: uuid("user_id").defaultRandom().primaryKey(),
    full_name: varchar("full_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password_hash: varchar("password_hash", { length: 255 }).notNull(),
    role: varchar("role", { length: 20 }).notNull(), // student | educator
    is_verified: boolean("is_verified").default(false).notNull(),
    subscription_status: varchar("subscription_status", { length: 20 }),
    created_at: timestamp("created_at").defaultNow().notNull(),
});

// ================= RESOURCES =================
export const resources = pgTable("resources", {
    resource_id: uuid("resource_id").defaultRandom().primaryKey(),
    uploader_id: uuid("uploader_id")
        .notNull()
        .references(() => users.user_id),
    course_code: varchar("course_code", { length: 10 }).notNull(),
    semester: varchar("semester", { length: 10 }).notNull(),
    university: varchar("university", { length: 100 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    file_url: varchar("file_url", { length: 512 }).notNull(),
    upload_date: timestamp("upload_date").defaultNow().notNull(),
});

// ================= RATINGS =================
export const ratings = pgTable("ratings", {
    rating_id: serial("rating_id").primaryKey(),
    resource_id: uuid("resource_id")
        .notNull()
        .references(() => resources.resource_id),
    user_id: uuid("user_id")
        .notNull()
        .references(() => users.user_id),
    value: integer("value").notNull(), // 1–5
    rating_date: timestamp("rating_date").defaultNow().notNull(),
});

// ================= COMMENTS =================
export const comments = pgTable("comments", {
    comment_id: serial("comment_id").primaryKey(),
    resource_id: uuid("resource_id")
        .notNull()
        .references(() => resources.resource_id),
    user_id: uuid("user_id")
        .notNull()
        .references(() => users.user_id),
    text: varchar("text", { length: 2000 }).notNull(),
    comment_date: timestamp("comment_date").defaultNow().notNull(),
});

// ================= VERIFICATION =================
export const verification = pgTable("verification", {
    verification_id: serial("verification_id").primaryKey(),
    resource_id: uuid("resource_id")
        .unique()
        .notNull()
        .references(() => resources.resource_id),
    educator_id: uuid("educator_id")
        .notNull()
        .references(() => users.user_id),
    status: varchar("status", { length: 10 }).notNull(), // Verified | Rejected
    verified_date: timestamp("verified_date"),
});

// ================= AI REQUESTS =================
export const ai_requests = pgTable("ai_requests", {
    request_id: uuid("request_id").defaultRandom().primaryKey(),
    resource_id: uuid("resource_id")
        .notNull()
        .references(() => resources.resource_id),
    user_id: uuid("user_id")
        .notNull()
        .references(() => users.user_id),
    type: varchar("type", { length: 20 }).notNull(), // summary | flashcards | notes | etc.
    request_date: timestamp("request_date").defaultNow().notNull(),
    response_url: varchar("response_url", { length: 512 }),
});

// ================= NOTIFICATIONS =================
export const notifications = pgTable("notifications", {
    notification_id: serial("notification_id").primaryKey(),
    user_id: uuid("user_id")
        .notNull()
        .references(() => users.user_id),
    event_type: varchar("event_type", { length: 50 }).notNull(),
    message: text("message").notNull(),
    sent_date: timestamp("sent_date").defaultNow().notNull(),
});

// ================= OUTBOX (EVENT PIPELINE) =================
export const outbox = pgTable("outbox", {
    id: uuid("id").defaultRandom().primaryKey(),
    event_type: varchar("event_type", { length: 50 }).notNull(),
    payload: text("payload").notNull(), // JSON.stringify(event)
    created_at: timestamp("created_at").defaultNow().notNull(),
    processed: boolean("processed").default(false).notNull(),
    processed_at: timestamp("processed_at"),
});

// ================= RESOURCE TAGS =================
export const resource_tags = pgTable("resource_tags", {
    id: serial("id").primaryKey(),
    resource_id: uuid("resource_id")
        .notNull()
        .references(() => resources.resource_id),
    tag: varchar("tag", { length: 50 }).notNull(),
});

// ================= SAVED RESOURCES =================
export const saved_resources = pgTable("saved_resources", {
    saved_id: serial("saved_id").primaryKey(),
    user_id: uuid("user_id")
        .notNull()
        .references(() => users.user_id),
    resource_id: uuid("resource_id")
        .notNull()
        .references(() => resources.resource_id),
    saved_at: timestamp("saved_at").defaultNow().notNull(),
});

// ================= REPORT FLAGS =================
export const report_flags = pgTable("report_flags", {
    report_id: serial("report_id").primaryKey(),
    resource_id: uuid("resource_id")
        .notNull()
        .references(() => resources.resource_id),
    reporter_id: uuid("reporter_id")
        .notNull()
        .references(() => users.user_id),
    reason: varchar("reason", { length: 255 }).notNull(),
    status: varchar("status", { length: 20 }).default("Pending").notNull(), // Pending | Resolved
    reported_at: timestamp("reported_at").defaultNow().notNull(),
});

// ================= RESOURCE VIEWS =================
export const resource_views = pgTable("resource_views", {
    id: serial("id").primaryKey(),
    resource_id: uuid("resource_id")
        .notNull()
        .references(() => resources.resource_id),
    user_id: uuid("user_id"),
    viewed_at: timestamp("viewed_at").defaultNow().notNull(),
});

// ================= UNIVERSITIES =================
export const universities = pgTable("universities", {
    university_id: serial("university_id").primaryKey(),
    name: varchar("name", { length: 120 }).unique().notNull(),
});

// ================= PROGRAMS =================
export const programs = pgTable("programs", {
    program_id: serial("program_id").primaryKey(),
    university_id: integer("university_id")
        .notNull()
        .references(() => universities.university_id),
    program_name: varchar("program_name", { length: 120 }).notNull(),
});

// ================= COURSES =================
export const courses = pgTable("courses", {
    course_id: serial("course_id").primaryKey(),
    program_id: integer("program_id")
        .notNull()
        .references(() => programs.program_id),
    course_code: varchar("course_code", { length: 10 }).notNull(),
    course_name: varchar("course_name", { length: 255 }).notNull(),
    semester: varchar("semester", { length: 20 }).notNull(),
});
