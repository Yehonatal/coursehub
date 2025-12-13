import { db } from "@/db";
import { resources as resourcesTable, comments, users } from "@/db/schema";
import { eq, desc, and, ne } from "drizzle-orm";
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

export async function getResourceComments(resourceId: string) {
    const rows = await db
        .select({
            id: comments.comment_id,
            content: comments.text,
            timestamp: comments.comment_date,
            author_first: users.first_name,
            author_last: users.last_name,
        })
        .from(comments)
        .innerJoin(users, eq(comments.user_id, users.user_id))
        .where(eq(comments.resource_id, resourceId))
        .orderBy(desc(comments.comment_date));

    return rows.map((row: any) => ({
        id: row.id.toString(),
        author: {
            name: `${row.author_first} ${row.author_last}`,
        },
        content: row.content,
        timestamp: row.timestamp.toISOString(),
        likes: 0,
        dislikes: 0,
        replies: [],
    }));
}

export async function getUserResources(
    userId: string,
    limit = 8
): Promise<ResourceWithTags[]> {
    const rows = await fetchResourceRows(
        eq(resourcesTable.uploader_id, userId),
        limit
    );

    if (rows.length === 0) return [];

    const ids = rows.map((r: any) => r.resource_id);
    const tagsById = await fetchTagsByIds(ids);
    const stats = await fetchStatsByIds(ids);

    return mapResourceRows(rows, tagsById, stats);
}

export async function getResourceById(
    id: string
): Promise<ResourceWithTags | null> {
    const rows = await fetchResourceRows(eq(resourcesTable.resource_id, id), 1);

    if (rows.length === 0) return null;

    const ids = [rows[0].resource_id];
    const tagsById = await fetchTagsByIds(ids);
    const stats = await fetchStatsByIds(ids);

    const result = mapResourceRows(rows, tagsById, stats);
    return result[0] || null;
}

export async function getRecommendedResources(
    limit = 6
): Promise<ResourceWithTags[]> {
    const rows = await fetchResourceRows(undefined, limit);

    if (rows.length === 0) return [];

    const ids = rows.map((r: any) => r.resource_id);
    const tagsById = await fetchTagsByIds(ids);
    const stats = await fetchStatsByIds(ids);

    return mapResourceRows(rows, tagsById, stats);
}
