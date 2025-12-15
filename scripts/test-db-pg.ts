import dotenv from "dotenv";
import path from "path";
import { Pool } from "pg";

// Load .env.local if it exists, otherwise .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function testConnection() {
    const connectionString = process.env.SUPABASE_DATABASE_URL;
    if (!connectionString) {
        console.error("❌ SUPABASE_DATABASE_URL is not defined");
        process.exit(1);
    }

    const maskedUrl = connectionString.replace(/:[^:@]*@/, ":****@");
    console.log(`🔌 Connecting to database with pg: ${maskedUrl}`);

    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
    });

    try {
        const client = await pool.connect();
        console.log("✅ Connected!");
        const result = await client.query("SELECT 1 as result");
        console.log("✅ Query successful:", result.rows[0]);
        client.release();
    } catch (err) {
        console.error("❌ Connection failed:", err);
    } finally {
        await pool.end();
        console.log("🔌 Pool closed");
    }
}

testConnection();
