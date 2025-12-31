"use server";

import { db } from "@/db";
import { universities, resources } from "@/db/schema";
import { ilike, or, desc, eq } from "drizzle-orm";
import { error } from "@/lib/logger";

export type SearchResult = {
    type: "university" | "resource";
    id: string | number;
    title: string;
    subtitle?: string;
    url: string;
};

export async function globalSearch(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 1) return [];

    try {
        const searchLower = query.toLowerCase();

        // Support syntax: "@universityToken rest of query". If the query starts with @token
        let universityFilterId: number | null = null;
        let effectiveQuery = query;

        const atMatch = query.trim().match(/^@(\S+)\s*(.*)$/);
        if (atMatch) {
            const token = atMatch[1];
            effectiveQuery = (atMatch[2] || "").trim();

            try {
                const uniRows = await db
                    .select({
                        id: universities.university_id,
                        name: universities.name,
                        slug: universities.slug,
                    })
                    .from(universities)
                    .where(
                        or(
                            eq(universities.slug, token),
                            ilike(universities.name, `%${token}%`)
                        )
                    )
                    .limit(1);
                if (uniRows.length > 0) {
                    universityFilterId = uniRows[0].id as number;
                }
            } catch (e) {
                // swallow - we will fallback to global search
            }
        }

        const [universityResults, resourceResults] = await Promise.all([
            db
                .select({
                    id: universities.university_id,
                    name: universities.name,
                    slug: universities.slug,
                    location: universities.location,
                })
                .from(universities)
                .where(
                    or(
                        ilike(universities.name, `%${query}%`),
                        ilike(universities.description, `%${query}%`)
                    )
                )
                .limit(10),
            // Resources: if we have a university filter, constrain by university_id and optionally use effectiveQuery
            (async () => {
                const baseQuery = db
                    .select({
                        id: resources.resource_id,
                        title: resources.title,
                        course_code: resources.course_code,
                        university: resources.university,
                    })
                    .from(resources as any);

                if (universityFilterId) {
                    baseQuery.where(
                        eq(resources.university_id, universityFilterId)
                    );
                }

                if (effectiveQuery) {
                    baseQuery.where(
                        or(
                            ilike(resources.title, `%${effectiveQuery}%`),
                            ilike(resources.course_code, `%${effectiveQuery}%`),
                            ilike(resources.university, `%${effectiveQuery}%`)
                        )
                    );
                }

                baseQuery.orderBy(desc(resources.upload_date)).limit(15);
                // @ts-ignore - Drizzle typing workaround for dynamic where
                return await baseQuery;
            })(),
        ]);

        const formattedUniversities: SearchResult[] = universityResults
            .sort((a: any, b: any) => {
                const aStarts = a.name.toLowerCase().startsWith(searchLower);
                const bStarts = b.name.toLowerCase().startsWith(searchLower);
                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;
                return a.name.localeCompare(b.name);
            })
            .slice(0, 5)
            .map((u: any) => ({
                type: "university",
                id: u.id,
                title: u.name,
                subtitle: u.location || "University",
                url: `/university/${u.slug}`,
            }));

        const formattedResources: SearchResult[] = resourceResults
            .sort((a: any, b: any) => {
                const aStarts = a.title.toLowerCase().startsWith(searchLower);
                const bStarts = b.title.toLowerCase().startsWith(searchLower);
                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;
                return 0;
            })
            .slice(0, 10)
            .map((r: any) => ({
                type: "resource",
                id: r.id,
                title: r.title,
                subtitle: `${r.course_code} • ${r.university}`,
                url: `/resources/${r.id}`,
            }));

        // Combine and return
        return [...formattedUniversities, ...formattedResources];
    } catch (err) {
        error("Global search error:", err);
        return [];
    }
}
