import { db } from "@/db";
import { user_quotas, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const FREE_GENERATIONS_LIMIT = 5;
export const FREE_CHATS_LIMIT = 10;
export const PRO_GENERATIONS_LIMIT = 1000;
export const PRO_CHATS_LIMIT = 2000;

export async function checkQuota(userId: string, type: "generation" | "chat") {
    const user = await db.query.users.findFirst({
        where: eq(users.user_id, userId),
    });

    if (!user) throw new Error("User not found");

    const isPremium =
        user.subscription_status === "active" ||
        user.subscription_status === "pro";

    const generationLimit = isPremium
        ? PRO_GENERATIONS_LIMIT
        : FREE_GENERATIONS_LIMIT;
    const chatLimit = isPremium ? PRO_CHATS_LIMIT : FREE_CHATS_LIMIT;

    // Check quota
    let quota = await db.query.user_quotas.findFirst({
        where: eq(user_quotas.user_id, userId),
    });

    const now = new Date();
    const isNewDay =
        quota &&
        (now.getUTCDate() !== quota.last_reset_date.getUTCDate() ||
            now.getUTCMonth() !== quota.last_reset_date.getUTCMonth() ||
            now.getUTCFullYear() !== quota.last_reset_date.getUTCFullYear());

    if (!quota || isNewDay) {
        // Create or reset quota record
        await db
            .insert(user_quotas)
            .values({
                user_id: userId,
                ai_generations_count: 0,
                ai_chat_count: 0,
                last_reset_date: now,
            })
            .onConflictDoUpdate({
                target: user_quotas.user_id,
                set: {
                    ai_generations_count: 0,
                    ai_chat_count: 0,
                    last_reset_date: now,
                },
            });

        quota = {
            user_id: userId,
            ai_generations_count: 0,
            ai_chat_count: 0,
            storage_usage: quota?.storage_usage || 0,
            last_reset_date: now,
        };
    }

    if (
        type === "generation" &&
        quota.ai_generations_count >= generationLimit
    ) {
        throw new Error(
            `${
                isPremium ? "Premium" : "Free"
            } tier generation limit reached (${generationLimit}/day). Please try again tomorrow.`
        );
    }

    if (type === "chat" && quota.ai_chat_count >= chatLimit) {
        throw new Error(
            `${
                isPremium ? "Premium" : "Free"
            } tier chat limit reached (${chatLimit}/day). Please try again tomorrow.`
        );
    }

    return true;
}

export async function incrementQuota(
    userId: string,
    type: "generation" | "chat"
) {
    await db
        .update(user_quotas)
        .set({
            ai_generations_count:
                type === "generation"
                    ? sql`${user_quotas.ai_generations_count} + 1`
                    : undefined,
            ai_chat_count:
                type === "chat"
                    ? sql`${user_quotas.ai_chat_count} + 1`
                    : undefined,
        })
        .where(eq(user_quotas.user_id, userId));
}
