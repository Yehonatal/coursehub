import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { users } from "../db/schema";

async function main() {
    const connectionString = process.env.SUPABASE_DATABASE_URL;
    if (!connectionString) {
        console.error("SUPABASE_DATABASE_URL not found");
        process.exit(1);
    }

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    const db = drizzle(client);

    await db
        .insert(users)
        .values([
            {
                full_name: "Admin Educator",
                email: "admin@coursehub.edu",
                password_hash: "hashed",
                role: "educator",
            },
            {
                full_name: "Student User",
                email: "student@coursehub.edu",
                password_hash: "hashed",
                role: "student",
            },
        ])
        .onConflictDoNothing(); // Skip if already exists

    console.log("PG seed complete");
    await client.end();
    process.exit(0);
}

main().catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
});
