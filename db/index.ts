import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { warn } from "@/lib/logger";

const connectionString = process.env.SUPABASE_DATABASE_URL;

const globalForDb = globalThis as unknown as {
    conn: postgres.Sql | undefined;
};

let client: postgres.Sql | undefined;

if (connectionString) {
    // Ensure port 6543 is used
    // This is necessary because port 5432 (Session Pooler) often times out in serverless environments
    // or is blocked in some networks, while port 6543 (Transaction Pooler) is designed for this.
    let url = connectionString;
    if (url.includes("supabase.com") && url.includes(":5432")) {
        // console.log("🔧 Auto-switching to Supabase Transaction Pooler (port 6543)");
        url = url.replace(":5432", ":6543");
    }

    if (!globalForDb.conn) {
        // console.log("🔌 Initializing new DB connection pool...");
        globalForDb.conn = postgres(url, {
            prepare: false, // Crucial for Supabase Transaction Pooler (port 6543)
            max: 10, // Increased from 1 to handle more concurrent requests
            ssl: { rejectUnauthorized: false }, // Required for Supabase
            idle_timeout: 20, // Close idle connections quickly to avoid timeouts
            connect_timeout: 30,
        });
    }
    client = globalForDb.conn;
} else {
    warn("No SUPABASE_DATABASE_URL found — DB client not initialized.");
}

export const db = client
    ? drizzle(client, { schema, casing: "snake_case" })
    : (null as any);
