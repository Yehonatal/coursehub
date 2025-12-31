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
    sql,
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

import { parseTags } from "@/utils/parser";

export async function getRelatedResources(
    resourceId: string,
    university: string,
    limit = 3
): Promise<ResourceWithTags[]> {
    try {
        // Fetch the source resource row
        const sourceRows = await fetchResourceRows(
            eq(resourcesTable.resource_id, resourceId),
            1
        );
        if (sourceRows.length === 0) return [];

        const source = sourceRows[0];
        const sourceTags = new Set(parseTags(source.tags || ""));
        const sourceCourse = source.course_code || "";
        const sourceSemester = source.semester || "";
        const sourceIsAI = Boolean(source.is_ai);

        // Candidate pool: resources from same university (wider pool to score)
        const poolLimit = Math.max(limit * 10, 50);
        const candidateRows = await fetchResourceRows(
            and(
                eq(resourcesTable.university, university),
                ne(resourcesTable.resource_id, resourceId)
            ),
            poolLimit
        );

        if (candidateRows.length === 0) return [];

        const candidateIds = candidateRows.map((r: any) => r.resource_id);
        const stats = await fetchStatsByIds(candidateIds);

        // Precompute maxes for normalization
        let maxDownloads = 0;
        let maxViews = 0;
        candidateRows.forEach((r: any) => {
            const d = Number(
                r.downloads_count ?? stats.downloadById.get(r.resource_id) ?? 0
            );
            const v = Number(
                r.views_count ?? stats.viewById.get(r.resource_id) ?? 0
            );
            if (d > maxDownloads) maxDownloads = d;
            if (v > maxViews) maxViews = v;
        });

        // Score candidates
        const scored = candidateRows.map((r: any) => {
            const tags = new Set(parseTags(r.tags || ""));
            // Tag overlap score (Jaccard-like)
            const intersection = [...sourceTags].filter((t) =>
                tags.has(t)
            ).length;
            const union = new Set([...sourceTags, ...tags]).size || 1;
            const tagScore = intersection / union; // 0..1

            const courseMatch =
                sourceCourse && r.course_code === sourceCourse ? 1 : 0;
            const semesterMatch =
                sourceSemester && r.semester === sourceSemester ? 1 : 0;
            const verifiedBoost = r.is_verified ? 1 : 0;

            const downloads = Number(
                r.downloads_count ?? stats.downloadById.get(r.resource_id) ?? 0
            );
            const views = Number(
                r.views_count ?? stats.viewById.get(r.resource_id) ?? 0
            );

            const normDownloads =
                maxDownloads > 0 ? downloads / maxDownloads : 0;
            const normViews = maxViews > 0 ? views / maxViews : 0;
            const popularity = normDownloads * 0.6 + normViews * 0.4; // 0..1

            // AI penalty/boost: prefer same type as source; slightly prefer non-AI overall
            const aiBias = r.is_ai === sourceIsAI ? 0.2 : r.is_ai ? -0.3 : 0.1;

            // Weighted sum (tunable)
            const score =
                tagScore * 3 + // strong signal
                courseMatch * 2 +
                semesterMatch * 0.8 +
                verifiedBoost * 1.8 +
                popularity * 1.5 +
                aiBias +
                (new Date(r.upload_date).getTime() >
                Date.now() - 1000 * 60 * 60 * 24 * 30
                    ? 0.2
                    : 0); // slight freshness boost

            return { row: r, score };
        });

        // Sort and take top N
        scored.sort((a: any, b: any) => b.score - a.score);
        const selected = scored.slice(0, limit).map((s: any) => s.row);

        // Enrich and return
        const selectedIds = selected.map((r: any) => r.resource_id);
        const selectedStats = await fetchStatsByIds(selectedIds);
        return mapResourceRows(selected, selectedStats);
    } catch (err) {
        error("getRelatedResources failed:", err);
        // Fallback to simple method: same university, recent
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
        // Order by: verified first, then downloads, then views, prefer non-AI content, then recency
        const orderExpr = sql`
            ${resourcesTable.is_verified} DESC,
            ${resourcesTable.downloads_count} DESC,
            ${resourcesTable.views_count} DESC,
            ${resourcesTable.is_ai} ASC,
            ${resourcesTable.upload_date} DESC
        `;

        const rows = await fetchResourceRows(undefined, limit, orderExpr);

        if (rows.length === 0) return [];

        const ids = rows.map((r: any) => r.resource_id);
        const stats = await fetchStatsByIds(ids);

        // Map rows to enriched DTOs
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
