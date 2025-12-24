import { db } from "@/db";
import {
    resources as resourcesTable,
    comments,
    users,
    comment_reactions,
} from "@/db/schema";
import { debug, error } from "@/lib/logger";
import {
    eq,
    desc,
    and,
    or,
    ne,
    count,
    inArray,
    ilike,
    SQL,
    gte,
} from "drizzle-orm";
import {
    fetchResourceRows,
    fetchStatsByIds,
    mapResourceRows,
    ResourceWithTags,
} from "@/lib/dal/resource-helpers";
import { connectMongo } from "./mongodb/client";
import { getAIGenerationsModel } from "./mongodb/models";
import { isValidUUID } from "@/utils/helpers";

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
    const stats = await fetchStatsByIds(ids);

    return mapResourceRows(rows, stats);
}

export async function getResourceStats(resourceId: string) {
    if (!isValidUUID(resourceId)) {
        return {
            rating: 0,
            reviews: 0,
            views: 0,
            comments: 0,
            downloads: 0,
        };
    }
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
    if (!isValidUUID(resourceId)) return [];
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
        const userReactionMap = new Map<string, string | null>();

        if (commentIds.length > 0) {
            const [likeRows, dislikeRows, userReactions] = await Promise.all([
                db
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
                    .groupBy(comment_reactions.comment_id),
                db
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
                    .groupBy(comment_reactions.comment_id),
                userId
                    ? db
                          .select({
                              id: comment_reactions.comment_id,
                              type: comment_reactions.type,
                          })
                          .from(comment_reactions)
                          .where(
                              and(
                                  inArray(
                                      comment_reactions.comment_id,
                                      commentIds
                                  ),
                                  eq(comment_reactions.user_id, userId)
                              )
                          )
                    : Promise.resolve([]),
            ]);

            likeRows.forEach((r: any) =>
                likesMap.set(r.id.toString(), Number(r.cnt || 0))
            );
            dislikeRows.forEach((r: any) =>
                dislikesMap.set(r.id.toString(), Number(r.cnt || 0))
            );
            userReactions.forEach((r: any) =>
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
        const stats = await fetchStatsByIds(ids);

        return mapResourceRows(rows, stats);
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
        const stats = await fetchStatsByIds(ids);

        const result = mapResourceRows(rows, stats);
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
        const stats = await fetchStatsByIds(ids);

        return mapResourceRows(rows, stats);
    } catch (err) {
        error("getRecommendedResources failed:", err);
        return [];
    }
}

export async function searchResources(filters: {
    courseCode?: string;
    university?: string;
    tags?: string[];
    semester?: string;
    resourceType?: string;
    query?: string;
    dateRange?: string;
    limit?: number;
}): Promise<ResourceWithTags[]> {
    const {
        courseCode,
        university,
        tags,
        semester,
        resourceType,
        query,
        dateRange,
        limit = 20,
    } = filters;

    const conditions: SQL[] = [];

    if (courseCode) {
        conditions.push(ilike(resourcesTable.course_code, `%${courseCode}%`));
    }
    if (university) {
        conditions.push(ilike(resourcesTable.university, `%${university}%`));
    }
    if (semester) {
        conditions.push(ilike(resourcesTable.semester, `%${semester}%`));
    }
    if (resourceType) {
        // Handle plural/singular by stripping trailing 's' and using partial match
        const normalizedType = resourceType.toLowerCase().endsWith("s")
            ? resourceType.slice(0, -1)
            : resourceType;
        conditions.push(
            ilike(resourcesTable.resource_type, `%${normalizedType}%`)
        );
    }

    if (dateRange && dateRange !== "all") {
        const now = new Date();
        let startDate: Date | null = null;

        if (dateRange === "today") {
            startDate = new Date(now.setHours(0, 0, 0, 0));
        } else if (dateRange === "week") {
            startDate = new Date(now.setDate(now.getDate() - 7));
        } else if (dateRange === "month") {
            startDate = new Date(now.setMonth(now.getMonth() - 1));
        } else if (dateRange === "year") {
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        }

        if (startDate) {
            conditions.push(gte(resourcesTable.upload_date, startDate));
        }
    }
    if (query) {
        conditions.push(
            or(
                ilike(resourcesTable.title, `%${query}%`),
                ilike(resourcesTable.course_code, `%${query}%`),
                ilike(resourcesTable.university, `%${query}%`),
                ilike(resourcesTable.resource_type, `%${query}%`)
            ) as SQL
        );
    }
    if (tags && tags.length > 0) {
        tags.forEach((tag) => {
            if (tag) {
                conditions.push(ilike(resourcesTable.tags, `%${tag}%`));
            }
        });
    }

    try {
        debug("Searching resources with conditions:", conditions.length);
        const rows = await fetchResourceRows(
            conditions.length > 0 ? and(...conditions) : undefined,
            limit
        );

        if (rows.length === 0) return [];

        const ids = rows.map((r: any) => r.resource_id);
        const stats = await fetchStatsByIds(ids);

        return mapResourceRows(rows, stats);
    } catch (err) {
        error("searchResources failed:", err);
        return [];
    }
}

export async function getPopularAIGenerations(limit = 4) {
    try {
        await connectMongo();
        const Generation = getAIGenerationsModel();

        // Fetch globally popular (most viewed) generations
        const generations = await Generation.find({
            generationStatus: "succeeded",
        })
            .sort({ viewedCount: -1, createdAt: -1 })
            .limit(limit)
            .lean();

        return JSON.parse(JSON.stringify(generations));
    } catch (err) {
        error("getPopularAIGenerations failed:", err);
        return [];
    }
}
