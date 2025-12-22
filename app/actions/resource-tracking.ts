"use server";

import { db } from "@/db";
import { resources } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { error } from "@/lib/logger";

export async function trackResourceView(resourceId: string, _userId?: string) {
    // Track view in database (only counter now)
    try {
        await db
            .update(resources)
            .set({
                views_count: sql`${resources.views_count} + 1`,
            })
            .where(eq(resources.resource_id, resourceId));
        revalidatePath(`/resources/${resourceId}`);
    } catch (err) {
        error("Failed to track view:", err);
    }
}

export async function trackResourceDownload(
    resourceId: string,
    _userId?: string
) {
    try {
        await db
            .update(resources)
            .set({
                downloads_count: sql`${resources.downloads_count} + 1`,
            })
            .where(eq(resources.resource_id, resourceId));
        revalidatePath(`/resources/${resourceId}`);
    } catch (err) {
        error("Failed to track download:", err);
    }
}
