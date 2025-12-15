import { db } from "@/db";
import {
    resources as resourcesTable,
    ratings,
    comments,
    users,
} from "@/db/schema";
import { eq, inArray, count, avg, desc, SQL } from "drizzle-orm";
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

// DB row shapes returned by Drizzle; these are permissive since adapters may
// return `bigint` values for counts and/or `number`/`string` for averages.
type RatingRow = {
    id: string;
    average?: number | string | null;
    count: number | bigint;
};
type CommentRow = { id: string; count: number | bigint };
type ResourceStatRow = {
    id: string;
    views?: number | bigint | null;
    downloads?: number | bigint | null;
};

export async function fetchResourceRows(
    whereClause?: SQL | undefined,
    limit?: number,
    orderBy?: SQL
) {
    try {
        return await db
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
                file_size: resourcesTable.file_size,
                views_count: resourcesTable.views_count,
                downloads_count: resourcesTable.downloads_count,
                tags: resourcesTable.tags,
                // Author info join
                author_first: users.first_name,
                author_last: users.last_name,
                author_uni: users.university,
            })
            .from(resourcesTable)
            .leftJoin(users, eq(resourcesTable.uploader_id, users.user_id))
            .where(whereClause)
            .limit(limit || 100)
            .orderBy(orderBy || desc(resourcesTable.upload_date));
    } catch (err) {
        return [];
    }
}

export async function fetchTagsByIds(ids: string[]) {
    return new Map<string, string[]>();
}

export async function fetchStatsByIds(ids: string[]) {
    if (ids.length === 0)
        return {
            ratingById: new Map(),
            viewById: new Map(),
            commentById: new Map(),
            downloadById: new Map(),
        };

    try {
        // Ratings
        const ratingRows: RatingRow[] = await db
            .select({
                id: ratings.resource_id,
                average: avg(ratings.value),
                count: count(ratings.rating_id),
            })
            .from(ratings)
            .where(inArray(ratings.resource_id, ids))
            .groupBy(ratings.resource_id);

        const ratingById = new Map<
            string,
            { average: number; count: number }
        >();
        ratingRows.forEach((r: RatingRow) => {
            ratingById.set(r.id, {
                average: parseFloat(r.average?.toString() || "0"),
                count: Number(r.count || 0),
            });
        });

        // Comments
        const commentRows: CommentRow[] = await db
            .select({
                id: comments.resource_id,
                count: count(comments.comment_id),
            })
            .from(comments)
            .where(inArray(comments.resource_id, ids))
            .groupBy(comments.resource_id);

        const commentById = new Map<string, number>();
        commentRows.forEach((r: CommentRow) =>
            commentById.set(r.id, Number(r.count || 0))
        );

        // Views & Downloads (from resources table directly)
        const resourceStats: ResourceStatRow[] = await db
            .select({
                id: resourcesTable.resource_id,
                views: resourcesTable.views_count,
                downloads: resourcesTable.downloads_count,
            })
            .from(resourcesTable)
            .where(inArray(resourcesTable.resource_id, ids));

        const viewById = new Map<string, number>();
        const downloadById = new Map<string, number>();

        resourceStats.forEach((r: ResourceStatRow) => {
            viewById.set(r.id, Number(r.views || 0));
            downloadById.set(r.id, Number(r.downloads || 0));
        });

        return { ratingById, viewById, commentById, downloadById };
    } catch (error) {
        console.error("Error fetching stats:", error);
        return {
            ratingById: new Map(),
            viewById: new Map(),
            commentById: new Map(),
            downloadById: new Map(),
        };
    }
}

export function mapResourceRows(
    rows: any[],
    _tagsById: Map<string, string[]>, // Unused now
    stats: {
        ratingById: Map<string, { average: number; count: number }>;
        viewById: Map<string, number>;
        commentById: Map<string, number>;
        downloadById: Map<string, number>;
    }
): ResourceWithTags[] {
    return rows.map((r: any) => {
        const ratingData = stats.ratingById.get(r.resource_id);
        // Split tags string into array
        const tags = r.tags
            ? r.tags
                  .split(",")
                  .map((t: string) => t.trim())
                  .filter(Boolean)
            : [];

        return {
            resource_id: r.resource_id,
            title: r.title,
            description: r.description,
            upload_date:
                r.upload_date instanceof Date
                    ? r.upload_date.toISOString()
                    : r.upload_date,
            uploader_id: r.uploader_id,
            course_code: r.course_code,
            semester: r.semester,
            university: r.university,
            file_url: r.file_url,
            resource_type: r.resource_type,
            mime_type: r.mime_type,
            file_size: r.file_size,
            tags: tags,
            author: {
                name: `${r.author_first} ${r.author_last}`,
                university: r.author_uni || undefined,
            },
            rating: ratingData?.average || 0,
            reviews: ratingData?.count || 0,
            views: r.views_count ?? stats.viewById.get(r.resource_id) ?? 0,
            comments: stats.commentById.get(r.resource_id) || 0,
            downloads:
                r.downloads_count ?? stats.downloadById.get(r.resource_id) ?? 0,
        };
    });
}

export async function createResource(
    data: {
        uploader_id: string;
        course_code: string;
        semester: string;
        university: string;
        title: string;
        description?: string;
        file_url: string;
        mime_type: string;
        file_size: number;
        resource_type?: string;
    },
    tags: string[]
) {
    const tagsString = tags.join(",");

    return db.transaction(async (tx: any) => {
        const [inserted] = await tx
            .insert(resourcesTable)
            .values({
                ...data,
                tags: tagsString,
            })
            .returning();

        return inserted;
    });
}
