"use server";

import { db } from "@/db";
import { resource_views, resource_downloads } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function trackResourceView(resourceId: string, userId?: string) {
    // Track view in database
    try {
        await db.insert(resource_views).values({
            resource_id: resourceId,
            user_id: userId, // Can be null/undefined
        });
        revalidatePath(`/resources/${resourceId}`);
    } catch (error) {
        console.error("Failed to track view:", error);
    }
}

export async function trackResourceDownload(
    resourceId: string,
    userId?: string
) {
    try {
        await db.insert(resource_downloads).values({
            resource_id: resourceId,
            user_id: userId,
        });
        revalidatePath(`/resources/${resourceId}`);
    } catch (error) {
        console.error("Failed to track download:", error);
    }
}
