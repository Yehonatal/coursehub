import { NextResponse } from "next/server";
import { db } from "@/db";
import { test } from "@/db/schema";

export async function GET() {
    try {
        if (!db) {
            return NextResponse.json(
                { error: "Database not connected" },
                { status: 500 }
            );
        }

        // Example: Select all rows from test table
        const rows = await db.select().from(test);

        // Example: Insert a new row
        const newRow = await db
            .insert(test)
            .values({ name: "api-test-" + Date.now() })
            .returning();

        return NextResponse.json({
            message: "Drizzle test successful",
            existingRows: rows,
            newRow: newRow[0],
        });
    } catch (error) {
        console.error("Drizzle test error:", error);
        return NextResponse.json(
            { error: "Database operation failed" },
            { status: 500 }
        );
    }
}
