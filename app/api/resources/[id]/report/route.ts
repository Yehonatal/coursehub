import { NextResponse } from "next/server";
import { db } from "@/db";
import { report_flags } from "@/db/schema";
import { validateRequest } from "@/lib/auth/session";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { user } = await validateRequest();

    if (!user) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const { reason } = body;

        if (!reason || typeof reason !== "string") {
            return NextResponse.json(
                { success: false, message: "Reason is required" },
                { status: 400 }
            );
        }

        await db.insert(report_flags).values({
            resource_id: id,
            reporter_id: user.user_id,
            reason: reason.slice(0, 255), // Truncate to fit schema
        });

        return NextResponse.json({
            success: true,
            message: "Report submitted successfully",
        });
    } catch (err) {
        console.error("Failed to submit report:", err);
        return NextResponse.json(
            { success: false, message: "Failed to submit report" },
            { status: 500 }
        );
    }
}
