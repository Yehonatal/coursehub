import { NextResponse } from "next/server";
import { db } from "@/db";
import { validateRequest } from "@/lib/auth/session";
import { comments, comment_reactions } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string; commentId: string }> }
) {
    const { id, commentId } = await params;
    const { user } = await validateRequest();
    if (!user)
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );

    const body = await request.json().catch(() => ({}));
    const type = body?.type;
    if (type !== "like" && type !== "dislike") {
        return NextResponse.json(
            { success: false, message: "Invalid reaction type" },
            { status: 400 }
        );
    }

    try {
        // verify comment belongs to resource
        const parent = await db
            .select({ id: comments.comment_id, resource: comments.resource_id })
            .from(comments)
            .where(eq(comments.comment_id, Number(commentId)));
        if (!parent || parent.length === 0 || parent[0].resource !== id) {
            return NextResponse.json(
                { success: false, message: "Comment not found" },
                { status: 404 }
            );
        }

        // check existing
        const existing = await db
            .select({
                id: comment_reactions.reaction_id,
                type: comment_reactions.type,
            })
            .from(comment_reactions)
            .where(
                and(
                    eq(comment_reactions.comment_id, Number(commentId)),
                    eq(comment_reactions.user_id, user.user_id)
                )
            );

        if (existing.length > 0) {
            const e = existing[0];
            if (e.type === type) {
                // toggle off
                await db
                    .delete(comment_reactions)
                    .where(eq(comment_reactions.reaction_id, e.id));
            } else {
                // update
                await db
                    .update(comment_reactions)
                    .set({ type })
                    .where(eq(comment_reactions.reaction_id, e.id));
            }
        } else {
            await db
                .insert(comment_reactions)
                .values({
                    comment_id: Number(commentId),
                    user_id: user.user_id,
                    type,
                });
        }

        // return counts
        const likes = await db
            .select({
                id: comment_reactions.comment_id,
                cnt: count(comment_reactions.reaction_id),
            })
            .from(comment_reactions)
            .where(
                and(
                    eq(comment_reactions.comment_id, Number(commentId)),
                    eq(comment_reactions.type, "like")
                )
            )
            .groupBy(comment_reactions.comment_id);
        const dislikes = await db
            .select({
                id: comment_reactions.comment_id,
                cnt: count(comment_reactions.reaction_id),
            })
            .from(comment_reactions)
            .where(
                and(
                    eq(comment_reactions.comment_id, Number(commentId)),
                    eq(comment_reactions.type, "dislike")
                )
            )
            .groupBy(comment_reactions.comment_id);

        const likeCount = likes.length > 0 ? Number(likes[0].cnt || 0) : 0;
        const dislikeCount =
            dislikes.length > 0 ? Number(dislikes[0].cnt || 0) : 0;

        // determine user's current reaction
        const userReactionRow = await db
            .select({ type: comment_reactions.type })
            .from(comment_reactions)
            .where(
                and(
                    eq(comment_reactions.comment_id, Number(commentId)),
                    eq(comment_reactions.user_id, user.user_id)
                )
            );
        const userReaction =
            userReactionRow.length > 0 ? userReactionRow[0].type : null;

        return NextResponse.json({
            success: true,
            data: { likes: likeCount, dislikes: dislikeCount, userReaction },
        });
    } catch (err) {
        console.error("React failed:", err);
        return NextResponse.json(
            { success: false, message: "Failed to react" },
            { status: 500 }
        );
    }
}
