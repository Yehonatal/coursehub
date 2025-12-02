import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Simple test table used to verify Neon/Postgres connectivity.
export const test = pgTable("test", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
});

export default { test };
