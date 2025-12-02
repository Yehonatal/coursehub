import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Simple test table used to verify Supabase/Postgres connectivity.
export const test = pgTable("test", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
});

export default { test };

// I will define my tables in here using drizzles type safe api

// export const resources = pgTable("resources", {
//     id: serial("id").primaryKey(),
//     title: text("title").notNull(),
//     fileUrl: text("file_url").notNull(), // Supabase Storage URL
//     courseId: integer("course_id").references(() => courses.id),
//     uploaderId: integer("uploader_id").references(() => users.id),
//     createdAt: timestamp("created_at").defaultNow(),
// });
