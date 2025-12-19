"use server";

import { validateRequest } from "@/lib/auth/session";
import { db } from "@/db";
import { users, user_quotas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";
import { sendEmail } from "@/lib/email/client";
import { premiumWelcomeEmailTemplate } from "@/lib/email/templates";

export async function buyPremium() {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized");

    try {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month subscription

        await db
            .update(users)
            .set({
                subscription_status: "pro",
                subscription_expiry: expiryDate,
            })
            .where(eq(users.user_id, user.user_id));

        // Create notification
        await createNotification({
            userId: user.user_id,
            eventType: "subscription",
            message:
                "Welcome to CourseHub Premium! You now have unlimited AI access and increased storage.",
            link: "/dashboard/settings",
        });

        // Send email
        if (user.email) {
            const displayName =
                user.first_name || user.email.split("@")[0] || "Student";
            await sendEmail({
                to: user.email,
                subject: "Welcome to CourseHub Premium!",
                text: `Hi ${displayName},\n\nWelcome to CourseHub Premium! You now have unlimited AI access and increased storage. Manage your subscription at /dashboard/settings\n\nThanks,\nCourseHub Team`,
                html: premiumWelcomeEmailTemplate(displayName),
            });
        }

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/settings");

        return { success: true, message: "Successfully upgraded to Premium!" };
    } catch (error) {
        console.error("buyPremium error:", error);
        return { success: false, message: "Failed to upgrade subscription." };
    }
}

export async function getUserQuota() {
    try {
        const { user } = await validateRequest();
        if (!user) return null;

        const quota = await db.query.user_quotas.findFirst({
            where: eq(user_quotas.user_id, user.user_id),
        });

        if (!quota) {
            return {
                ai_generations_count: 0,
                ai_chat_count: 0,
                storage_usage: 0,
            };
        }

        return quota;
    } catch (error) {
        console.error("Error in getUserQuota:", error);
        return {
            ai_generations_count: 0,
            ai_chat_count: 0,
            storage_usage: 0,
        };
    }
}
