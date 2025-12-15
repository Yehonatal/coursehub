import dotenv from "dotenv";
import path from "path";
import postgres from "postgres";

// Load .env.local if it exists, otherwise .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function testConnection() {
    const connectionString = process.env.SUPABASE_DATABASE_URL;
    if (!connectionString) {
        console.error("❌ SUPABASE_DATABASE_URL is not defined");
        process.exit(1);
    }

    // Mask password for logging
    const maskedUrl = connectionString.replace(/:[^:@]*@/, ":****@");
    console.log(`🔌 Connecting to database: ${maskedUrl}`);

    // Try forcing port 6543 (Transaction Pooler)
    const urlObj = new URL(connectionString);
    urlObj.port = "6543";
    const newConnectionString = urlObj.toString();
    console.log(
        `🔌 Trying port 6543: ${newConnectionString.replace(
            /:[^:@]*@/,
            ":****@"
        )}`
    );

    console.log("🔌 Connecting to database...");
    const sql = postgres(newConnectionString, {
        prepare: false,
        max: 1,
        ssl: { rejectUnauthorized: false },
        idle_timeout: 20,
        connect_timeout: 10,
        debug: (connection, query, params, types) => {
            console.log("Debug:", { connection, query });
        },
    });

    try {
        const result = await sql`select 1 as result`;
        console.log("✅ Connection successful:", result);
    } catch (err) {
        console.error("❌ Connection failed:", err);
    } finally {
        await sql.end();
        console.log("🔌 Connection closed");
    }
}

testConnection();
