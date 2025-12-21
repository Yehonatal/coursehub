"use server";

import { validateRequest } from "@/lib/auth/session";
import { db } from "@/db";
import { transactions, user_quotas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { error } from "@/lib/logger";
import { genTxRef, initializeTransaction } from "@/lib/payment/chapa/client";

export async function buyPremium() {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized");

    try {
        const tx_ref = await genTxRef({ prefix: "CH", size: 15 });
        const amount = "1498.5"; // Fixed price for premium
        const currency = "ETB";

        console.log("Initializing Chapa payment:", {
            tx_ref,
            amount,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
        });

        // Save transaction to DB
        await db.insert(transactions).values({
            user_id: user.user_id,
            tx_ref,
            amount: amount.toString(),
            currency,
            status: "pending",
        });

        const callback_url = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/chapa/webhook`;
        const return_url = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?payment=success&tx_ref=${tx_ref}`;

        const response = await initializeTransaction({
            first_name: user.first_name || "User",
            last_name: user.last_name || "Student",
            email: user.email,
            amount: amount.toString(),
            currency,
            tx_ref,
            callback_url,
            return_url,
        });

        if (response.status === "success" && response.data?.checkout_url) {
            return {
                success: true,
                checkout_url: response.data.checkout_url,
                tx_ref,
            };
        } else {
            return {
                success: false,
                message: response.message || "Failed to initialize payment",
            };
        }
    } catch (err: any) {
        error("buyPremium error:", err);
        return {
            success: false,
            message:
                err.response?.data?.message ||
                err.message ||
                "Failed to initialize payment. Please try again later.",
        };
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
    } catch (err) {
        error("Error in getUserQuota:", err);
        return {
            ai_generations_count: 0,
            ai_chat_count: 0,
            storage_usage: 0,
        };
    }
}
