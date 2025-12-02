import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

// Initialize a Drizzle DB instance using Supabase connection.
const connectionString = process.env.SUPABASE_DATABASE_URL;

let _db: any = null;

if (connectionString) {
    try {
        // Use node-postgres Pool for Supabase (better for server environments)
        const pool = new Pool({
            connectionString,
            ssl: { rejectUnauthorized: false },
            max: 5, // Reduce max connections for pooler
            min: 0, // No minimum connections
            idleTimeoutMillis: 10000, // Shorter idle timeout
            connectionTimeoutMillis: 5000, // Longer connection timeout
            allowExitOnIdle: true, // Allow pool to exit when idle
        });

        _db = drizzlePostgres(pool, {
            schema,
            casing: "snake_case",
        });
    } catch (e) {
        // Do not throw during module evaluation; export null so callers can handle missing DB.
        // eslint-disable-next-line no-console
        console.error("Failed to initialize DB client:", e);
        _db = null;
    }
} else {
    // eslint-disable-next-line no-console
    console.warn("No SUPABASE_DATABASE_URL found — DB client not initialized.");
}

export const db = _db;
