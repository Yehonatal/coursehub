import { NextResponse } from "next/server";
import { db } from "@/db";
import { report_flags, resources } from "@/db/schema";
import { validateRequest } from "@/lib/auth/session";
import { createNotification } from "@/app/actions/notifications";
import { eq } from "drizzle-orm";

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

        // Trigger notification for resource owner
        const [resource] = await db
            .select({
                uploader_id: resources.uploader_id,
                title: resources.title,
            })
            .from(resources)
            .where(eq(resources.resource_id, id));

        if (resource && resource.uploader_id !== user.user_id) {
            await createNotification({
                userId: resource.uploader_id,
                eventType: "report",
                message: `Your resource "${resource.title}" has been reported for: ${reason}`,
                link: `/resources/${id}`,
            });
        }

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
