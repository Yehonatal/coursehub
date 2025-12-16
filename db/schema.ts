import {
    pgTable,
    uuid,
    varchar,
    text,
    boolean,
    timestamp,
    integer,
    serial,
    index,
    uniqueIndex,
} from "drizzle-orm/pg-core";

// ================= USERS =================
export const users = pgTable("users", {
    user_id: uuid("user_id").defaultRandom().primaryKey(),
    first_name: varchar("first_name", { length: 50 }).notNull(),
    last_name: varchar("last_name", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password_hash: varchar("password_hash", { length: 255 }).notNull(),
    role: varchar("role", { length: 20 }).notNull(),
    university: varchar("university", { length: 100 }),
    headline: varchar("headline", { length: 150 }),
    school_id_url: varchar("school_id_url", { length: 512 }),
    is_verified: boolean("is_verified").default(false).notNull(),
    subscription_status: varchar("subscription_status", { length: 20 }),
    created_at: timestamp("created_at").defaultNow().notNull(),
});

// ================= RESOURCES =================
export const resources = pgTable(
    "resources",
    {
        resource_id: uuid("resource_id").defaultRandom().primaryKey(),
        uploader_id: uuid("uploader_id")
            .notNull()
            .references(() => users.user_id, { onDelete: "cascade" }),
        course_code: varchar("course_code", { length: 20 }).notNull(),
        semester: varchar("semester", { length: 20 }).notNull(),
        university: varchar("university", { length: 100 }).notNull(),
        title: varchar("title", { length: 255 }).notNull(),
        description: text("description"),
        file_url: varchar("file_url", { length: 512 }).notNull(),
        mime_type: varchar("mime_type", { length: 100 }),
        file_size: integer("file_size"),
        resource_type: varchar("resource_type", { length: 20 }),
        upload_date: timestamp("upload_date").defaultNow().notNull(),
        views_count: integer("views_count").default(0).notNull(),
        downloads_count: integer("downloads_count").default(0).notNull(),
        tags: text("tags"), // Comma-separated tags
        is_ai: boolean("is_ai").default(false).notNull(),
        is_verified: boolean("is_verified").default(false).notNull(),
    },
    (table) => ({
        idx_uploader: index("idx_resources_uploader").on(table.uploader_id),
    })
);

// ================= RATINGS =================
export const ratings = pgTable(
    "ratings",
    {
        rating_id: serial("rating_id").primaryKey(),
        resource_id: uuid("resource_id")
            .notNull()
            .references(() => resources.resource_id, { onDelete: "cascade" }),
        user_id: uuid("user_id")
            .notNull()
            .references(() => users.user_id, { onDelete: "cascade" }),
        value: integer("value").notNull(),
        rating_date: timestamp("rating_date").defaultNow().notNull(),
    },
    (table) => ({
        unique_user_rating: uniqueIndex("unique_rating").on(
            table.resource_id,
            table.user_id
        ),
    })
);

// ================= COMMENTS =================
export const comments = pgTable(
    "comments",
    {
        comment_id: serial("comment_id").primaryKey(),
        resource_id: uuid("resource_id")
            .notNull()
            .references(() => resources.resource_id, { onDelete: "cascade" }),
        user_id: uuid("user_id")
            .notNull()
            .references(() => users.user_id, { onDelete: "cascade" }),
        text: varchar("text", { length: 2000 }).notNull(),
        parent_comment_id: integer("parent_comment_id"),
        comment_date: timestamp("comment_date").defaultNow().notNull(),
    },
    (table) => ({
        idx_resource: index("idx_comments_resource").on(table.resource_id),
        idx_user: index("idx_comments_user").on(table.user_id),
        idx_parent: index("idx_comments_parent").on(table.parent_comment_id),
    })
);

export const comment_reactions = pgTable(
    "comment_reactions",
    {
        reaction_id: serial("reaction_id").primaryKey(),
        comment_id: integer("comment_id")
            .notNull()
            .references(() => comments.comment_id, { onDelete: "cascade" }),
        user_id: uuid("user_id")
            .notNull()
            .references(() => users.user_id, { onDelete: "cascade" }),
        type: varchar("type", { length: 10 }).notNull(), // 'like' or 'dislike'
        reacted_at: timestamp("reacted_at").defaultNow().notNull(),
    },
    (table) => ({
        unique_user_reaction: uniqueIndex("unique_comment_reaction").on(
            table.comment_id,
            table.user_id
        ),
        idx_comment: index("idx_comment_reactions_comment").on(
            table.comment_id
        ),
    })
);

// ================= VERIFICATION =================
export const verification = pgTable(
    "verification",
    {
        verification_id: serial("verification_id").primaryKey(),
        resource_id: uuid("resource_id")
            .notNull()
            .unique()
            .references(() => resources.resource_id, { onDelete: "cascade" }),
        educator_id: uuid("educator_id")
            .notNull()
            .references(() => users.user_id),
        status: varchar("status", { length: 10 }).notNull(),
        verified_date: timestamp("verified_date"),
    },
    (table) => ({
        idx_educator: index("idx_verification_educator").on(table.educator_id),
    })
);

// ================= AI REQUESTS =================
export const ai_requests = pgTable(
    "ai_requests",
    {
        request_id: uuid("request_id").defaultRandom().primaryKey(),
        resource_id: uuid("resource_id")
            .notNull()
            .references(() => resources.resource_id, { onDelete: "cascade" }),
        user_id: uuid("user_id")
            .notNull()
            .references(() => users.user_id, { onDelete: "cascade" }),
        type: varchar("type", { length: 20 }).notNull(),
        request_date: timestamp("request_date").defaultNow().notNull(),
        response_url: varchar("response_url", { length: 512 }),
    },
    (table) => ({
        idx_resource: index("idx_ai_requests_resource").on(table.resource_id),
        idx_user: index("idx_ai_requests_user").on(table.user_id),
    })
);

// ================= NOTIFICATIONS =================
export const notifications = pgTable(
    "notifications",
    {
        notification_id: serial("notification_id").primaryKey(),
        user_id: uuid("user_id")
            .notNull()
            .references(() => users.user_id, { onDelete: "cascade" }),
        event_type: varchar("event_type", { length: 50 }).notNull(),
        message: text("message").notNull(),
        sent_date: timestamp("sent_date").defaultNow().notNull(),
    },
    (table) => ({
        idx_user: index("idx_notifications_user").on(table.user_id),
    })
);

// ============== BOOKMARKS / SAVED RESOURCES ==============
export const saved_resources = pgTable(
    "saved_resources",
    {
        saved_id: serial("saved_id").primaryKey(),
        user_id: uuid("user_id")
            .notNull()
            .references(() => users.user_id, { onDelete: "cascade" }),
        resource_id: uuid("resource_id")
            .notNull()
            .references(() => resources.resource_id, { onDelete: "cascade" }),
        saved_at: timestamp("saved_at").defaultNow().notNull(),
    },
    (table) => ({
        unique_save: uniqueIndex("unique_saved").on(
            table.user_id,
            table.resource_id
        ),
    })
);

// ================= REPORT FLAGS =================
export const report_flags = pgTable(
    "report_flags",
    {
        report_id: serial("report_id").primaryKey(),
        resource_id: uuid("resource_id")
            .notNull()
            .references(() => resources.resource_id, { onDelete: "cascade" }),
        reporter_id: uuid("reporter_id")
            .notNull()
            .references(() => users.user_id),
        reason: varchar("reason", { length: 255 }).notNull(),
        status: varchar("status", { length: 20 }).default("Pending").notNull(),
        reported_at: timestamp("reported_at").defaultNow().notNull(),
    },
    (table) => ({
        idx_resource: index("idx_report_flags_resource").on(table.resource_id),
        idx_reporter: index("idx_report_flags_reporter").on(table.reporter_id),
    })
);

// ================= UNIVERSITY STRUCTURE =================
export const universities = pgTable("universities", {
    university_id: serial("university_id").primaryKey(),
    name: varchar("name", { length: 120 }).unique().notNull(),
});

export const programs = pgTable(
    "programs",
    {
        program_id: serial("program_id").primaryKey(),
        university_id: integer("university_id")
            .notNull()
            .references(() => universities.university_id),
        program_name: varchar("program_name", { length: 120 }).notNull(),
    },
    (table) => ({
        idx_university: index("idx_programs_university").on(
            table.university_id
        ),
    })
);

export const courses = pgTable(
    "courses",
    {
        course_id: serial("course_id").primaryKey(),
        program_id: integer("program_id")
            .notNull()
            .references(() => programs.program_id),
        course_code: varchar("course_code", { length: 10 }).notNull(),
        course_name: varchar("course_name", { length: 255 }).notNull(),
        semester: varchar("semester", { length: 20 }).notNull(),
    },
    (table) => ({
        idx_program: index("idx_courses_program").on(table.program_id),
    })
);

// ================= SESSIONS =================
export const sessions = pgTable("sessions", {
    session_id: varchar("session_id", { length: 255 }).primaryKey(),
    user_id: uuid("user_id")
        .notNull()
        .references(() => users.user_id, { onDelete: "cascade" }),
    expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
});

// ================= VERIFICATION TOKENS =================
export const verificationTokens = pgTable("verification_tokens", {
    token: varchar("token", { length: 255 }).primaryKey(),
    user_id: uuid("user_id")
        .notNull()
        .references(() => users.user_id, { onDelete: "cascade" }),
    expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
});

// ================= PASSWORD RESET TOKENS =================
export const passwordResetTokens = pgTable("password_reset_tokens", {
    token: varchar("token", { length: 255 }).primaryKey(),
    user_id: uuid("user_id")
        .notNull()
        .references(() => users.user_id, { onDelete: "cascade" }),
    expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
});

// ================= QUOTAS =================
export const user_quotas = pgTable("user_quotas", {
    user_id: uuid("user_id")
        .notNull()
        .references(() => users.user_id, { onDelete: "cascade" })
        .primaryKey(),
    ai_generations_count: integer("ai_generations_count").default(0).notNull(),
    last_reset_date: timestamp("last_reset_date").defaultNow().notNull(),
});
