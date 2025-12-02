import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";

import * as schema from "./schema";

// Initialize a Drizzle DB instance depending on environment.
// We prefer `NEON_DATABASE_URL` but fall back to `DATABASE_URL` for compatibility.
const connectionString =
    process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;

let _db: any = null;

if (connectionString) {
    try {
        // Vercel or serverless environment -> use neon serverless client
        if (process.env.VERCEL || process.env.NEXT_RUNTIME === "edge") {
            _db = drizzleNeon({
                client: neon(connectionString),
                schema,
                casing: "snake_case",
            });
        } else {
            // Local or node environment -> use node-postgres adapter
            _db = drizzlePostgres(connectionString, {
                schema,
                casing: "snake_case",
            });
        }
    } catch (e) {
        // Do not throw during module evaluation; export null so callers can handle missing DB.
        // eslint-disable-next-line no-console
        console.error("Failed to initialize DB client:", e);
        _db = null;
    }
} else {
    // eslint-disable-next-line no-console
    console.warn(
        "No NEON_DATABASE_URL or DATABASE_URL found — DB client not initialized."
    );
}

export const db = _db;
