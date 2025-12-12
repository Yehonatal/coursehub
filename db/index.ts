import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

// Initialize a Drizzle DB instance using Supabase connection.
const connectionString = process.env.SUPABASE_DATABASE_URL;

// Singleton pattern for DB connection to prevent exhaustion in dev
const globalForDb = globalThis as unknown as {
    conn: Pool | undefined;
};

let pool: Pool | undefined;

if (connectionString) {
    try {
        if (process.env.NODE_ENV === "production") {
            pool = new Pool({
                connectionString,
                ssl: { rejectUnauthorized: false },
                max: 10, // Higher limit for production
                min: 0,
                idleTimeoutMillis: 10000,
                connectionTimeoutMillis: 5000,
                allowExitOnIdle: true,
            });
            // Add error handler to prevent uncaught exceptions
            pool.on("error", (err) => {
                console.error("Unexpected error on idle client", err);
            });
        } else {
            if (!globalForDb.conn) {
                globalForDb.conn = new Pool({
                    connectionString,
                    ssl: { rejectUnauthorized: false },
                    max: 5, // Low limit for dev
                    min: 0,
                    idleTimeoutMillis: 10000,
                    connectionTimeoutMillis: 5000,
                    allowExitOnIdle: true,
                });
                // Add error handler to prevent uncaught exceptions
                globalForDb.conn.on("error", (err) => {
                    console.error("Unexpected error on idle client", err);
                });
            }
            pool = globalForDb.conn;
        }
    } catch (e) {
        console.error("Failed to initialize DB pool:", e);
    }
} else {
    // eslint-disable-next-line no-console
    console.warn("No SUPABASE_DATABASE_URL found — DB client not initialized.");
}

let _db: any = null;
if (pool) {
    _db = drizzlePostgres(pool, {
        schema,
        casing: "snake_case",
    });
}

export const db = _db;
