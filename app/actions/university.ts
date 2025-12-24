"use server";

import { db } from "@/db";
import { universities, users, resources, ratings, comments } from "@/db/schema";
import { eq, and, desc, sql, count, avg, or, ilike } from "drizzle-orm";
import { uploadFile } from "@/lib/storage/upload";

import type { ActionResponse } from "@/app/actions/auth";
import { revalidatePath } from "next/cache";
import { error } from "@/lib/logger";
import { slugify } from "@/utils/helpers";

export async function getUniversityBySlug(slug: string) {
    try {
        const result = await db
            .select()
            .from(universities)
            .where(eq(universities.slug, slug))
            .limit(1);

        return result[0] || null;
    } catch (err) {
        error("Error fetching university by slug:", err);
        return null;
    }
}

export async function getUniversityStats(universityId: number) {
    try {
        // Count students
        const [studentCount] = await db
            .select({ count: count() })
            .from(users)
            .where(eq(users.university_id, universityId));

        // Count total resources
        const [resourceCount] = await db
            .select({ count: count() })
            .from(resources)
            .where(eq(resources.university_id, universityId));

        // Count verified resources
        const [verifiedCount] = await db
            .select({ count: count() })
            .from(resources)
            .where(
                and(
                    eq(resources.university_id, universityId),
                    eq(resources.is_verified, true)
                )
            );

        return {
            students: studentCount.count,
            resources: resourceCount.count,
            verified: verifiedCount.count,
        };
    } catch (err) {
        error("Error fetching university stats:", err);
        return { students: 0, resources: 0, verified: 0 };
    }
}

export async function getUniversityContributors(universityId: number) {
    try {
        // Top 3 contributors based on average rating and download count of their resources
        const contributors = await db
            .select({
                user_id: users.user_id,
                first_name: users.first_name,
                last_name: users.last_name,
                headline: users.headline,
                total_downloads: sql<number>`sum(${resources.downloads_count})`,
                avg_rating: sql<number>`avg(${ratings.value})`,
            })
            .from(users)
            .innerJoin(resources, eq(users.user_id, resources.uploader_id))
            .leftJoin(ratings, eq(resources.resource_id, ratings.resource_id))
            .where(eq(users.university_id, universityId))
            .groupBy(users.user_id)
            .orderBy(desc(sql`sum(${resources.downloads_count})`))
            .limit(3);

        return contributors;
    } catch (err) {
        error("Error fetching university contributors:", err);
        return [];
    }
}

export async function getUniversityResources(
    universityId: number,
    type: "verified" | "recent"
) {
    try {
        const query = db
            .select({
                resource_id: resources.resource_id,
                title: resources.title,
                description: resources.description,
                tags: resources.tags,
                downloads_count: resources.downloads_count,
                is_ai: resources.is_ai,
                is_verified: resources.is_verified,
                upload_date: resources.upload_date,
                file_url: resources.file_url,
                mime_type: resources.mime_type,
                avg_rating: sql<number>`COALESCE(avg(${ratings.value}), 0)`,
                reviews_count: count(ratings.rating_id),
                comments_count: sql<number>`(SELECT count(*) FROM ${comments} WHERE ${comments.resource_id} = ${resources.resource_id})`,
            })
            .from(resources)
            .leftJoin(ratings, eq(resources.resource_id, ratings.resource_id))
            .where(eq(resources.university_id, universityId))
            .groupBy(resources.resource_id);

        if (type === "verified") {
            query.where(
                and(
                    eq(resources.university_id, universityId),
                    eq(resources.is_verified, true)
                )
            );
            query.orderBy(desc(resources.downloads_count));
        } else {
            query.orderBy(desc(resources.upload_date));
        }

        return await query.limit(4);
    } catch (err) {
        error("Error fetching university resources:", err);
        return [];
    }
}

export async function updateUniversity(
    _prevState: ActionResponse,
    formData: FormData
): Promise<ActionResponse> {
    try {
        const universityId = parseInt(formData.get("universityId") as string);
        const description = formData.get("description") as string;
        const website = formData.get("website") as string;
        const email = formData.get("email") as string;
        const location = formData.get("location") as string;
        const isPrivate = formData.get("isPrivate") === "true";
        const logoFile = formData.get("logo") as File | null;
        const bannerFile = formData.get("banner") as File | null;

        console.log("Updating university:", {
            universityId,
            hasLogo: !!(logoFile && logoFile.size > 0),
            hasBanner: !!(bannerFile && bannerFile.size > 0),
        });

        if (isNaN(universityId)) {
            return { success: false, message: "Invalid university ID" };
        }

        const updateData: any = {
            description,
            website,
            email,
            location,
            is_private: isPrivate,
            updated_at: new Date(),
        };

        // Handle logo upload
        if (logoFile && logoFile.size > 0) {
            const logoPath = `universities/${universityId}/logo-${Date.now()}`;
            const logoUrl = await uploadFile(logoFile, logoPath);
            updateData.logo_url = logoUrl;
        }

        // Handle banner upload
        if (bannerFile && bannerFile.size > 0) {
            const bannerPath = `universities/${universityId}/banner-${Date.now()}`;
            const bannerUrl = await uploadFile(bannerFile, bannerPath);
            updateData.banner_url = bannerUrl;
        }

        await db
            .update(universities)
            .set(updateData)
            .where(eq(universities.university_id, universityId));

        console.log("University updated successfully in DB");

        revalidatePath("/", "layout");
        return { success: true, message: "University updated successfully" };
    } catch (err) {
        error("Error updating university:", err);
        return { success: false, message: "Failed to update university" };
    }
}

export async function searchUniversities(query: string, limit: number = 5) {
    if (!query) return [];
    try {
        return await db
            .select()
            .from(universities)
            .where(
                or(
                    ilike(universities.name, `%${query}%`),
                    ilike(universities.description, `%${query}%`)
                )
            )
            .limit(limit);
    } catch (err) {
        error("Error searching universities:", err);
        return [];
    }
}

export async function getUniversities() {
    try {
        return await db
            .select({
                university_id: universities.university_id,
                name: universities.name,
                slug: universities.slug,
            })
            .from(universities)
            .orderBy(universities.name);
    } catch (err) {
        error("Error fetching all universities:", err);
        return [];
    }
}

export async function createUniversity(
    name: string
): Promise<ActionResponse & { university?: any }> {
    try {
        const slug = slugify(name);

        const [newUniversity] = await db
            .insert(universities)
            .values({
                name,
                slug,
                is_official: false,
            })
            .returning();

        return {
            success: true,
            message: "University created successfully",
            university: newUniversity,
        };
    } catch (err) {
        error("Error creating university:", err);
        return { success: false, message: "Failed to create university" };
    }
}
