import { db } from "@/db";
import {
    resources as resourcesTable,
    comments,
    users,
    comment_reactions,
} from "@/db/schema";
import { error } from "@/lib/logger";
import { eq, desc, and, ne, count, inArray } from "drizzle-orm";
import {
    fetchResourceRows,
    fetchTagsByIds,
    fetchStatsByIds,
    mapResourceRows,
    ResourceWithTags,
} from "@/lib/dal/resource-helpers";

export type { ResourceWithTags };

export async function getRelatedResources(
    resourceId: string,
    university: string,
    limit = 3
): Promise<ResourceWithTags[]> {
    const rows = await fetchResourceRows(
        and(
            eq(resourcesTable.university, university),
            ne(resourcesTable.resource_id, resourceId)
        ),
        limit
    );

    if (rows.length === 0) return [];

    const ids = rows.map((r: any) => r.resource_id);
    const tagsById = await fetchTagsByIds(ids);
    const stats = await fetchStatsByIds(ids);

    return mapResourceRows(rows, tagsById, stats);
}

export async function getResourceStats(resourceId: string) {
    const stats = await fetchStatsByIds([resourceId]);
    const ratingData = stats.ratingById.get(resourceId);
    return {
        rating: ratingData?.average || 0,
        reviews: ratingData?.count || 0,
        views: stats.viewById.get(resourceId) || 0,
        comments: stats.commentById.get(resourceId) || 0,
        downloads: stats.downloadById.get(resourceId) || 0,
    };
}

export async function getResourceComments(resourceId: string, userId?: string) {
    try {
        // Fetch all comments for resource, with author and parent id
        const rows = await db
            .select({
                id: comments.comment_id,
                content: comments.text,
                timestamp: comments.comment_date,
                parent: comments.parent_comment_id,
                author_first: users.first_name,
                author_last: users.last_name,
            })
            .from(comments)
            .innerJoin(users, eq(comments.user_id, users.user_id))
            .where(eq(comments.resource_id, resourceId))
            .orderBy(desc(comments.comment_date));

        const commentIds = rows.map((r: any) => r.id);

        // Build reaction counts
        const likesMap = new Map<string, number>();
        const dislikesMap = new Map<string, number>();

        if (commentIds.length > 0) {
            const likeRows: any[] = await db
                .select({
                    id: comment_reactions.comment_id,
                    cnt: count(comment_reactions.reaction_id),
                })
                .from(comment_reactions)
                .where(
                    and(
                        inArray(comment_reactions.comment_id, commentIds),
                        eq(comment_reactions.type, "like")
                    )
                )
                .groupBy(comment_reactions.comment_id);

            likeRows.forEach((r) =>
                likesMap.set(r.id.toString(), Number(r.cnt || 0))
            );

            const dislikeRows: any[] = await db
                .select({
                    id: comment_reactions.comment_id,
                    cnt: count(comment_reactions.reaction_id),
                })
                .from(comment_reactions)
                .where(
                    and(
                        inArray(comment_reactions.comment_id, commentIds),
                        eq(comment_reactions.type, "dislike")
                    )
                )
                .groupBy(comment_reactions.comment_id);

            dislikeRows.forEach((r) =>
                dislikesMap.set(r.id.toString(), Number(r.cnt || 0))
            );
        }

        // User reactions (if userId provided)
        const userReactionMap = new Map<string, string | null>();
        if (userId && commentIds.length > 0) {
            const ur = await db
                .select({
                    id: comment_reactions.comment_id,
                    type: comment_reactions.type,
                })
                .from(comment_reactions)
                .where(
                    and(
                        inArray(comment_reactions.comment_id, commentIds),
                        eq(comment_reactions.user_id, userId)
                    )
                );
            ur.forEach((r: any) =>
                userReactionMap.set(r.id.toString(), r.type)
            );
        }

        // Build nested structure
        const byId = new Map<string, any>();
        rows.forEach((row: any) => {
            const id = row.id.toString();
            byId.set(id, {
                id,
                author: { name: `${row.author_first} ${row.author_last}` },
                content: row.content,
                timestamp: row.timestamp.toISOString(),
                likes: likesMap.get(id) || 0,
                dislikes: dislikesMap.get(id) || 0,
                replies: [],
                userReaction: userReactionMap.get(id) || null,
                parentId: row.parent ? row.parent.toString() : null,
            });
        });

        const topLevel: any[] = [];
        rows.forEach((row: any) => {
            const id = row.id.toString();
            const parent = row.parent;
            if (parent) {
                const p = byId.get(parent.toString());
                if (p) p.replies.push(byId.get(id));
            } else {
                topLevel.push(byId.get(id));
            }
        });

        return topLevel;
    } catch (err) {
        error("getResourceComments failed:", err);
        return [];
    }
}

export async function getUserResources(
    userId: string,
    limit = 8
): Promise<ResourceWithTags[]> {
    try {
        const rows = await fetchResourceRows(
            eq(resourcesTable.uploader_id, userId),
            limit
        );

        if (rows.length === 0) return [];

        const ids = rows.map((r: any) => r.resource_id);
        const tagsById = await fetchTagsByIds(ids);
        const stats = await fetchStatsByIds(ids);

        return mapResourceRows(rows, tagsById, stats);
    } catch (err) {
        error("getUserResources failed:", err);
        return [];
    }
}

export async function getResourceById(
    id: string
): Promise<ResourceWithTags | null> {
    try {
        const rows = await fetchResourceRows(
            eq(resourcesTable.resource_id, id),
            1
        );

        if (rows.length === 0) return null;

        const ids = [rows[0].resource_id];
        const tagsById = await fetchTagsByIds(ids);
        const stats = await fetchStatsByIds(ids);

        const result = mapResourceRows(rows, tagsById, stats);
        return result[0] || null;
    } catch (err) {
        error("getResourceById failed:", err);
        return null;
    }
}

export async function getRecommendedResources(
    limit = 6
): Promise<ResourceWithTags[]> {
    try {
        const rows = await fetchResourceRows(undefined, limit);

        if (rows.length === 0) return [];

        const ids = rows.map((r: any) => r.resource_id);
        const tagsById = await fetchTagsByIds(ids);
        const stats = await fetchStatsByIds(ids);

        return mapResourceRows(rows, tagsById, stats);
    } catch (err) {
        error("getRecommendedResources failed:", err);
        return [];
    }
}
