import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import bcrypt from "bcrypt";
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

    const passwordHash = await bcrypt.hash("password123", 12);

    await db
        .insert(users)
        .values([
            {
                first_name: "Admin",
                last_name: "Educator",
                email: "admin1@coursehub.edu",
                password_hash: passwordHash,
                role: "educator",
                university: "hu",
            },
            {
                first_name: "Student",
                last_name: "User",
                email: "student1@coursehub.edu",
                password_hash: passwordHash,
                role: "student",
                university: "hu",
            },
        ])
        .onConflictDoUpdate({
            target: users.email,
            set: { password_hash: passwordHash },
        });

    console.log("PG seed complete");
    await client.end();
    process.exit(0);
}

main().catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
});
