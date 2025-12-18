"use server";

import { validateRequest } from "@/lib/auth/session";
import { getNotificationPreferencesModel } from "@/lib/mongodb/models";
import { connectMongo as connectToDatabase } from "@/lib/mongodb/client";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/app/actions/auth";
import { sendEmail } from "@/lib/email/client";
import { notificationPreferenceChangedEmailTemplate } from "@/lib/email/templates";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, and, desc, count } from "drizzle-orm";

export type Notification = {
    notification_id: number;
    user_id: string;
    event_type: string;
    message: string;
    link: string | null;
    is_read: boolean;
    sent_date: Date;
};

export async function createNotification(data: {
    userId: string;
    eventType: string;
    message: string;
    link?: string;
}) {
    try {
        await db.insert(notifications).values({
            user_id: data.userId,
            event_type: data.eventType,
            message: data.message,
            link: data.link || null,
        });
        revalidatePath("/dashboard/notifications");
        return { success: true };
    } catch (error) {
        console.error("createNotification", error);
        return { success: false };
    }
}

export async function getNotifications() {
    const { user } = await validateRequest();
    if (!user) return [];

    try {
        const userNotifications = await db
            .select()
            .from(notifications)
            .where(eq(notifications.user_id, user.user_id))
            .orderBy(desc(notifications.sent_date));

        return userNotifications;
    } catch (error) {
        console.error("getNotifications", error);
        return [];
    }
}

export async function getUnreadNotificationCount() {
    const { user } = await validateRequest();
    if (!user) return 0;

    try {
        const result = await db
            .select({ value: count() })
            .from(notifications)
            .where(
                and(
                    eq(notifications.user_id, user.user_id),
                    eq(notifications.is_read, false)
                )
            );

        return result[0].value;
    } catch (error) {
        console.error("getUnreadNotificationCount", error);
        return 0;
    }
}

export async function markNotificationAsRead(notificationId: number) {
    const { user } = await validateRequest();
    if (!user) return { success: false, message: "Unauthorized" };

    try {
        await db
            .update(notifications)
            .set({ is_read: true })
            .where(
                and(
                    eq(notifications.notification_id, notificationId),
                    eq(notifications.user_id, user.user_id)
                )
            );

        revalidatePath("/dashboard/notifications");
        return { success: true };
    } catch (error) {
        console.error("markNotificationAsRead", error);
        return { success: false, message: "Failed to mark as read" };
    }
}

export async function markAllNotificationsAsRead() {
    const { user } = await validateRequest();
    if (!user) return { success: false, message: "Unauthorized" };

    try {
        await db
            .update(notifications)
            .set({ is_read: true })
            .where(eq(notifications.user_id, user.user_id));

        revalidatePath("/dashboard/notifications");
        return { success: true };
    } catch (error) {
        console.error("markAllNotificationsAsRead", error);
        return { success: false, message: "Failed to mark all as read" };
    }
}

export async function getNotificationPreferences() {
    const { user } = await validateRequest();
    if (!user) return null;

    try {
        await connectToDatabase();
        const Model = getNotificationPreferencesModel();
        let prefs = await Model.findOne({ userId: user.user_id });

        if (!prefs) {
            prefs = await Model.create({
                userId: user.user_id,
                emailNotifications: true,
                pushNotifications: false,
                resourceUpdates: true,
                commentReplies: true,
            });
        }

        return JSON.parse(JSON.stringify(prefs));
    } catch (error) {
        console.error("getNotificationPreferences", error);
        return null;
    }
}

export async function updateNotificationPreferences(data: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    resourceUpdates?: boolean;
    commentReplies?: boolean;
    pushToken?: string;
}): Promise<ActionResponse> {
    const { user } = await validateRequest();
    if (!user) {
        return { success: false, message: "Unauthorized" };
    }

    try {
        await connectToDatabase();
        const Model = getNotificationPreferencesModel();

        await Model.findOneAndUpdate(
            { userId: user.user_id },
            { $set: data },
            { upsert: true, new: true }
        );

        revalidatePath("/dashboard/settings");

        // Send notification email if email notifications are enabled
        if (user.email) {
            await sendEmail({
                to: user.email,
                subject: "Notification Preferences Updated",
                text: "Your notification preferences on CourseHub have been updated.",
                html: notificationPreferenceChangedEmailTemplate(),
            });
        }

        return { success: true, message: "Preferences updated" };
    } catch (error) {
        console.error("updateNotificationPreferences", error);
        return { success: false, message: "Failed to update preferences" };
    }
}
