import "dotenv/config";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import postgres from "postgres";

import { supabase, supabaseAdmin } from "../lib/supabase/client";

async function main() {
    console.log("Starting Supabase connectivity test...");

    if (!supabase && !supabaseAdmin) {
        console.error(
            "No Supabase client available. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set, and optionally SUPABASE_SERVICE_ROLE_KEY for admin operations."
        );
        process.exit(1);
    }

    const admin = supabaseAdmin || supabase;

    // 1) List buckets to verify storage access
    try {
        const { data: buckets, error: bErr } =
            await admin.storage.listBuckets();
        if (bErr) throw bErr;
        console.log(
            "Buckets:",
            buckets?.map((b: any) => b.name)
        );
    } catch (e) {
        console.warn(
            "Could not list buckets (may require service role key or bucket permissions):",
            (e as Error).message
        );
    }

    const bucketName = "coursebucket";

    // 2) Try upload a small test file if admin client available
    if (supabaseAdmin) {
        try {
            const fileName = `test-upload-${uuidv4()}.txt`;
            const content = "supabase-connect-test";
            const buffer = Buffer.from(content, "utf8");

            // upload from buffer
            const { error: uploadErr } = await supabaseAdmin.storage
                .from(bucketName)
                .upload(fileName, buffer, { contentType: "text/plain" });

            if (uploadErr) throw uploadErr;
            console.log(
                `Uploaded test file to bucket ${bucketName}: ${fileName}`
            );

            // list files in bucket root
            const { data: listData, error: listErr } =
                await supabaseAdmin.storage
                    .from(bucketName)
                    .list("", { limit: 100 });
            if (listErr) throw listErr;
            console.log(
                "Files in bucket (sample):",
                listData?.slice(0, 10).map((f: any) => f.name)
            );
        } catch (e) {
            console.warn(
                "Upload test failed (check SUPABASE_SERVICE_ROLE_KEY and bucket permissions):",
                (e as Error).message
            );
        }
    } else {
        console.log(
            "SUPABASE_SERVICE_ROLE_KEY not present — skipping upload test (admin key required)."
        );
    }

    // 3) If a Supabase DB connection URL is provided (SUPABASE_DB_URL), create a table and insert a row.
    const supaDbUrl =
        process.env.SUPABASE_DB_URL || process.env.SUPABASE_DATABASE_URL;
    if (supaDbUrl) {
        try {
            const sql = postgres(supaDbUrl, {
                ssl: { rejectUnauthorized: false },
            });
            await sql`
        CREATE TABLE IF NOT EXISTS test_supabase (
          id serial PRIMARY KEY,
          name text NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `;

            const inserted = await sql`
        INSERT INTO test_supabase (name) VALUES ('supabase-connect-test') RETURNING *
      `;
            console.log("Inserted row into test_supabase:", inserted);
            await sql.end({ timeout: 5 });
        } catch (e) {
            console.warn(
                "Failed to create/insert test_supabase table. Ensure SUPABASE_DB_URL is correct and reachable:",
                (e as Error).message
            );
        }
    } else {
        console.log(
            "No SUPABASE_DB_URL set — skipping DB table creation. To run DB schema operations, set SUPABASE_DB_URL to your Supabase Postgres connection string."
        );
    }

    console.log("Supabase connectivity test finished.");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
