import { NextResponse } from "next/server";
import { getResourceComments } from "@/lib/resources";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { validateRequest } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const { user } = await validateRequest();
        const rows = await getResourceComments(id, user?.user_id);
        return NextResponse.json({ success: true, data: rows });
    } catch (err) {
        console.error("GET comments failed:", err);
        return NextResponse.json(
            { success: false, message: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}

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

    const body = await request.json().catch(() => ({}));
    const content = (body?.content || "").trim();
    const parentId = body?.parentId;

    if (!content) {
        return NextResponse.json(
            { success: false, message: "Comment is empty" },
            { status: 400 }
        );
    }
    if (content.length > 2000) {
        return NextResponse.json(
            { success: false, message: "Comment too long" },
            { status: 400 }
        );
    }

    try {
        // if parentId provided, verify parent exists and belongs to resource
        if (parentId) {
            const parentRow = await db
                .select({
                    id: comments.comment_id,
                    resource: comments.resource_id,
                })
                .from(comments)
                .where(eq(comments.comment_id, Number(parentId)));
            if (
                !parentRow ||
                parentRow.length === 0 ||
                parentRow[0].resource !== id
            ) {
                return NextResponse.json(
                    { success: false, message: "Invalid parent comment" },
                    { status: 400 }
                );
            }
        }

        const [inserted] = await db
            .insert(comments)
            .values({
                resource_id: id,
                user_id: user.user_id,
                text: content,
                parent_comment_id: parentId ? Number(parentId) : null,
            })
            .returning();
        const parentValue = inserted.parent_comment_id
            ? inserted.parent_comment_id.toString()
            : null;

        const response = {
            id: inserted.comment_id.toString(),
            content: inserted.text,
            timestamp: inserted.comment_date.toISOString(),
            author: `${user.first_name} ${user.last_name}`,
            parentId: parentValue,
        };

        return NextResponse.json(
            { success: true, data: response },
            { status: 201 }
        );
    } catch (err) {
        console.error("Create comment failed:", err);
        return NextResponse.json(
            { success: false, message: "Failed to create comment" },
            { status: 500 }
        );
    }
}
