import "dotenv/config";
import postgres from "postgres";

async function main() {
    const connStr = process.env.NEON_DATABASE_URL;
    if (!connStr) {
        console.error("NEON_DATABASE_URL is not set in environment");
        process.exit(1);
    }

    // Create a postgres client; Neon requires SSL
    const sql = postgres(connStr, { ssl: { rejectUnauthorized: false } });

    // Ensure table exists (safe for repeated runs)
    await sql`
		CREATE TABLE IF NOT EXISTS test (
			id serial PRIMARY KEY,
			name text NOT NULL,
			created_at timestamptz NOT NULL DEFAULT now()
		)
	`;

    // Insert a single row for connectivity test
    const result = await sql`
		INSERT INTO test (name) VALUES ('neon-connect-test') RETURNING *
	`;

    console.log("Inserted test row:", result);

    await sql.end({ timeout: 5 });
}

main().catch((err) => {
    console.error("Error running seed:", err);
    process.exit(1);
});
