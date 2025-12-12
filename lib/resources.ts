import { db } from "@/db";
import {
    resources as resourcesTable,
    resource_tags,
    users,
    ratings,
    comments,
    resource_views,
    resource_downloads,
} from "@/db/schema";
import { eq, desc, inArray, count, avg, and, ne } from "drizzle-orm";
import { Resource } from "@/app/types/resource";

export type ResourceWithTags = Resource & {
    tags: string[];
    author?: {
        name: string;
        university?: string;
    };
    rating?: number;
    reviews?: number;
    views?: number;
    comments?: number;
    downloads?: number;
};

export async function getRelatedResources(
    resourceId: string,
    university: string,
    limit = 3
): Promise<ResourceWithTags[]> {
    const rows = await db
        .select({
            resource_id: resourcesTable.resource_id,
            title: resourcesTable.title,
            description: resourcesTable.description,
            upload_date: resourcesTable.upload_date,
            uploader_id: resourcesTable.uploader_id,
            course_code: resourcesTable.course_code,
            semester: resourcesTable.semester,
            university: resourcesTable.university,
            file_url: resourcesTable.file_url,
            resource_type: resourcesTable.resource_type,
            mime_type: resourcesTable.mime_type,
        })
        .from(resourcesTable)
        .where(
            and(
                eq(resourcesTable.university, university),
                ne(resourcesTable.resource_id, resourceId)
            )
        )
        .limit(limit);

    if (rows.length === 0) return [];

    const ids = rows.map((r: any) => r.resource_id);

    const tagRows = await db
        .select({
            resource_id: resource_tags.resource_id,
            tag: resource_tags.tag,
        })
        .from(resource_tags)
        .where(inArray(resource_tags.resource_id, ids));

    const tagsById = new Map<string, string[]>();
    for (const t of tagRows) {
        const id = t.resource_id;
        const arr = tagsById.get(id) || [];
        arr.push(t.tag);
        tagsById.set(id, arr);
    }

    // fetch stats for the related resource ids
    const ratingRows = await db
        .select({
            id: ratings.resource_id,
            average: avg(ratings.value),
            count: count(ratings.rating_id),
        })
        .from(ratings)
        .where(inArray(ratings.resource_id, ids))
        .groupBy(ratings.resource_id);

    const viewRows = await db
        .select({
            id: resource_views.resource_id,
            count: count(resource_views.id),
        })
        .from(resource_views)
        .where(inArray(resource_views.resource_id, ids))
        .groupBy(resource_views.resource_id);

    const commentRows = await db
        .select({ id: comments.resource_id, count: count(comments.comment_id) })
        .from(comments)
        .where(inArray(comments.resource_id, ids))
        .groupBy(comments.resource_id);

    let downloadRows: Array<{ id: string; count: bigint }> = [];
    try {
        downloadRows = await db
            .select({
                id: resource_downloads.resource_id,
                count: count(resource_downloads.id),
            })
            .from(resource_downloads)
            .where(inArray(resource_downloads.resource_id, ids))
            .groupBy(resource_downloads.resource_id);
    } catch (err) {
        console.warn(
            "resource_downloads aggregated query failed (likely migration not applied):",
            err
        );
        downloadRows = [];
    }

    const ratingById = new Map<string, { average: number; count: number }>();
    for (const r of ratingRows)
        ratingById.set(r.id, {
            average: Number(r.average) || 0,
            count: Number(r.count) || 0,
        });
    const viewById = new Map<string, number>();
    for (const v of viewRows) viewById.set(v.id, Number(v.count) || 0);
    const commentById = new Map<string, number>();
    for (const c of commentRows) commentById.set(c.id, Number(c.count) || 0);
    const downloadById = new Map<string, number>();
    for (const d of downloadRows) downloadById.set(d.id, Number(d.count) || 0);

    return rows.map((r: any) => ({
        ...r,
        upload_date:
            r.upload_date instanceof Date
                ? r.upload_date.toISOString()
                : r.upload_date,
        tags: tagsById.get(r.resource_id) || [],
        rating: ratingById.get(r.resource_id)?.average || 0,
        reviews: ratingById.get(r.resource_id)?.count || 0,
        views: viewById.get(r.resource_id) || 0,
        comments: commentById.get(r.resource_id) || 0,
        downloads: downloadById.get(r.resource_id) || 0,
    }));
}

export async function getResourceStats(resourceId: string) {
    const [ratingData] = await db
        .select({
            average: avg(ratings.value),
            count: count(ratings.rating_id),
        })
        .from(ratings)
        .where(eq(ratings.resource_id, resourceId));

    const [viewData] = await db
        .select({
            count: count(resource_views.id),
        })
        .from(resource_views)
        .where(eq(resource_views.resource_id, resourceId));

    const [commentData] = await db
        .select({
            count: count(comments.comment_id),
        })
        .from(comments)
        .where(eq(comments.resource_id, resourceId));

    let downloadData: { count: bigint } | undefined;
    try {
        [downloadData] = await db
            .select({
                count: count(resource_downloads.id),
            })
            .from(resource_downloads)
            .where(eq(resource_downloads.resource_id, resourceId));
    } catch (err) {
        console.warn(
            "resource_downloads query failed (likely migration not applied):",
            err
        );
        downloadData = { count: BigInt(0) } as any;
    }

    return {
        rating: Number(ratingData?.average) || 0,
        reviews: Number(ratingData?.count) || 0,
        views: Number(viewData?.count) || 0,
        comments: Number(commentData?.count) || 0,
        downloads: Number(downloadData?.count) || 0,
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
        timestamp: row.timestamp.toISOString(), // simplified for now
        likes: 0,
        dislikes: 0,
        replies: [],
    }));
}

export async function getUserResources(
    userId: string,
    limit = 8
): Promise<ResourceWithTags[]> {
    const rows = await db
        .select({
            resource_id: resourcesTable.resource_id,
            title: resourcesTable.title,
            description: resourcesTable.description,
            upload_date: resourcesTable.upload_date,
            uploader_id: resourcesTable.uploader_id,
            course_code: resourcesTable.course_code,
            semester: resourcesTable.semester,
            university: resourcesTable.university,
            file_url: resourcesTable.file_url,
            resource_type: resourcesTable.resource_type,
            mime_type: resourcesTable.mime_type,
        })
        .from(resourcesTable)
        .where(eq(resourcesTable.uploader_id, userId))
        .orderBy(desc(resourcesTable.upload_date))
        .limit(limit);

    if (rows.length === 0) return [];

    const ids = rows.map((r: any) => r.resource_id);

    const tagRows = await db
        .select({
            resource_id: resource_tags.resource_id,
            tag: resource_tags.tag,
        })
        .from(resource_tags)
        .where(inArray(resource_tags.resource_id, ids));

    const tagsById = new Map<string, string[]>();
    for (const t of tagRows) {
        const id = t.resource_id;
        const arr = tagsById.get(id) || [];
        arr.push(t.tag);
        tagsById.set(id, arr);
    }

    // Fetch stats
    const ratingRows = await db
        .select({
            id: ratings.resource_id,
            average: avg(ratings.value),
            count: count(ratings.rating_id),
        })
        .from(ratings)
        .where(inArray(ratings.resource_id, ids))
        .groupBy(ratings.resource_id);

    const viewRows = await db
        .select({
            id: resource_views.resource_id,
            count: count(resource_views.id),
        })
        .from(resource_views)
        .where(inArray(resource_views.resource_id, ids))
        .groupBy(resource_views.resource_id);

    const commentRows = await db
        .select({ id: comments.resource_id, count: count(comments.comment_id) })
        .from(comments)
        .where(inArray(comments.resource_id, ids))
        .groupBy(comments.resource_id);

    let downloadRows: Array<{ id: string; count: bigint }> = [];
    try {
        downloadRows = await db
            .select({
                id: resource_downloads.resource_id,
                count: count(resource_downloads.id),
            })
            .from(resource_downloads)
            .where(inArray(resource_downloads.resource_id, ids))
            .groupBy(resource_downloads.resource_id);
    } catch (err) {
        console.warn("resource_downloads aggregated query failed:", err);
        downloadRows = [];
    }

    const ratingById = new Map<string, { average: number; count: number }>();
    for (const r of ratingRows)
        ratingById.set(r.id, {
            average: Number(r.average) || 0,
            count: Number(r.count) || 0,
        });
    const viewById = new Map<string, number>();
    for (const v of viewRows) viewById.set(v.id, Number(v.count) || 0);
    const commentById = new Map<string, number>();
    for (const c of commentRows) commentById.set(c.id, Number(c.count) || 0);
    const downloadById = new Map<string, number>();
    for (const d of downloadRows) downloadById.set(d.id, Number(d.count) || 0);

    return rows.map((r: any) => ({
        ...r,
        upload_date:
            r.upload_date instanceof Date
                ? r.upload_date.toISOString()
                : r.upload_date,
        tags: tagsById.get(r.resource_id) || [],
        rating: ratingById.get(r.resource_id)?.average || 0,
        reviews: ratingById.get(r.resource_id)?.count || 0,
        views: viewById.get(r.resource_id) || 0,
        comments: commentById.get(r.resource_id) || 0,
        downloads: downloadById.get(r.resource_id) || 0,
    }));
}

export async function getResourceById(
    id: string
): Promise<ResourceWithTags | null> {
    const [resource] = await db
        .select({
            resource_id: resourcesTable.resource_id,
            title: resourcesTable.title,
            description: resourcesTable.description,
            course_code: resourcesTable.course_code,
            semester: resourcesTable.semester,
            resource_type: resourcesTable.resource_type,
            upload_date: resourcesTable.upload_date,
            uploader_id: resourcesTable.uploader_id,
            university: resourcesTable.university,
            file_url: resourcesTable.file_url,
        })
        .from(resourcesTable)
        .where(eq(resourcesTable.resource_id, id))
        .limit(1);

    if (!resource) return null;

    const tagRows = await db
        .select({
            tag: resource_tags.tag,
        })
        .from(resource_tags)
        .where(eq(resource_tags.resource_id, resource.resource_id));

    const tags = tagRows.map((tr: { tag: string }) => tr.tag);

    const [authorRow] = await db
        .select({
            first_name: users.first_name,
            last_name: users.last_name,
            university: users.university,
        })
        .from(users)
        .where(eq(users.user_id, resource.uploader_id))
        .limit(1);

    const author = authorRow
        ? {
              name: `${authorRow.first_name} ${authorRow.last_name}`,
              university: authorRow.university || undefined,
          }
        : undefined;

    const stats = await getResourceStats(id);

    return {
        ...resource,
        upload_date:
            resource.upload_date instanceof Date
                ? resource.upload_date.toISOString()
                : resource.upload_date,
        tags,
        author,
        ...stats,
    };
}

export async function getRecommendedResources(
    limit = 6
): Promise<ResourceWithTags[]> {
    const rows = await db
        .select({
            resource_id: resourcesTable.resource_id,
            title: resourcesTable.title,
            description: resourcesTable.description,
            upload_date: resourcesTable.upload_date,
            uploader_id: resourcesTable.uploader_id,
            course_code: resourcesTable.course_code,
            semester: resourcesTable.semester,
            university: resourcesTable.university,
            file_url: resourcesTable.file_url,
            resource_type: resourcesTable.resource_type,
            mime_type: resourcesTable.mime_type,
        })
        .from(resourcesTable)
        .orderBy(desc(resourcesTable.upload_date))
        .limit(limit);

    if (rows.length === 0) return [];

    const ids = rows.map((r: any) => r.resource_id);

    const tagRows = await db
        .select({
            resource_id: resource_tags.resource_id,
            tag: resource_tags.tag,
        })
        .from(resource_tags)
        .where(inArray(resource_tags.resource_id, ids));

    const tagsById = new Map<string, string[]>();
    for (const t of tagRows) {
        const id = t.resource_id;
        const arr = tagsById.get(id) || [];
        arr.push(t.tag);
        tagsById.set(id, arr);
    }

    // Fetch stats
    const ratingRows = await db
        .select({
            id: ratings.resource_id,
            average: avg(ratings.value),
            count: count(ratings.rating_id),
        })
        .from(ratings)
        .where(inArray(ratings.resource_id, ids))
        .groupBy(ratings.resource_id);

    const viewRows = await db
        .select({
            id: resource_views.resource_id,
            count: count(resource_views.id),
        })
        .from(resource_views)
        .where(inArray(resource_views.resource_id, ids))
        .groupBy(resource_views.resource_id);

    const commentRows = await db
        .select({ id: comments.resource_id, count: count(comments.comment_id) })
        .from(comments)
        .where(inArray(comments.resource_id, ids))
        .groupBy(comments.resource_id);

    let downloadRows: Array<{ id: string; count: bigint }> = [];
    try {
        downloadRows = await db
            .select({
                id: resource_downloads.resource_id,
                count: count(resource_downloads.id),
            })
            .from(resource_downloads)
            .where(inArray(resource_downloads.resource_id, ids))
            .groupBy(resource_downloads.resource_id);
    } catch (err) {
        console.warn("resource_downloads aggregated query failed:", err);
        downloadRows = [];
    }

    const ratingById = new Map<string, { average: number; count: number }>();
    for (const r of ratingRows)
        ratingById.set(r.id, {
            average: Number(r.average) || 0,
            count: Number(r.count) || 0,
        });
    const viewById = new Map<string, number>();
    for (const v of viewRows) viewById.set(v.id, Number(v.count) || 0);
    const commentById = new Map<string, number>();
    for (const c of commentRows) commentById.set(c.id, Number(c.count) || 0);
    const downloadById = new Map<string, number>();
    for (const d of downloadRows) downloadById.set(d.id, Number(d.count) || 0);

    return rows.map((r: any) => ({
        ...r,
        upload_date:
            r.upload_date instanceof Date
                ? r.upload_date.toISOString()
                : r.upload_date,
        tags: tagsById.get(r.resource_id) || [],
        rating: ratingById.get(r.resource_id)?.average || 0,
        reviews: ratingById.get(r.resource_id)?.count || 0,
        views: viewById.get(r.resource_id) || 0,
        comments: commentById.get(r.resource_id) || 0,
        downloads: downloadById.get(r.resource_id) || 0,
    }));
}
