"use server";

import { validateRequest } from "@/lib/auth/session";
import { db } from "@/db";
import { transactions, user_quotas, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { error, info } from "@/lib/logger";
import { genTxRef, initializeTransaction } from "@/lib/payment/chapa/client";
import { createNotification } from "./notifications";
import { sendEmail } from "@/lib/email/client";
import { premiumWelcomeEmailTemplate } from "@/lib/email/templates";

export async function buyPremium(baseUrl?: string, isDemo: boolean = false) {
    const { user } = await validateRequest();
    if (!user) throw new Error("Unauthorized");

    try {
        const tx_ref = `coursehub-${crypto.randomUUID()}`;
        const amount = "1498.50"; // Fixed price for premium
        const currency = "ETB";

        // Use provided baseUrl or fallback to env
        const appUrl = baseUrl || process.env.NEXT_PUBLIC_APP_URL;

        console.log(`${isDemo ? "DEMO: " : ""}Initializing Chapa payment:`, {
            tx_ref,
            amount,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            appUrl,
        });

        // Save transaction to DB
        await db.insert(transactions).values({
            user_id: user.user_id,
            tx_ref,
            amount: amount.toString(),
            currency,
            status: isDemo ? "completed" : "pending",
        });

        if (isDemo) {
            await completeSubscription(tx_ref, "demo_mode");
            return {
                success: true,
                isDemo: true,
                message: "Demo upgrade successful!",
            };
        }

        const callback_url = `${appUrl}/api/payments/chapa/webhook`;
        const return_url = `${appUrl}/dashboard/settings?payment=verifying&tx_ref=${tx_ref}`;

        const response = await initializeTransaction({
            first_name: user.first_name || "Customer",
            last_name: user.last_name || "",
            email: user.email,
            amount: amount.toString(),
            currency,
            tx_ref,
            callback_url,
            return_url,
            customization: {
                title: "CourseHub",
                description: "Upgrade to CourseHub Premium Plan",
            },
        });

        if (response.status === "success" && response.data?.checkout_url) {
            return {
                success: true,
                checkout_url: response.data.checkout_url,
                tx_ref,
            };
        } else {
            let message = response.message || "Failed to initialize payment";
            if (typeof message === "object") {
                message = Object.values(message).flat().join(", ");
            }
            return {
                success: false,
                message,
            };
        }
    } catch (err: any) {
        error("buyPremium error:", err);

        let message = "Failed to initialize payment. Please try again later.";
        const errorData = err.response?.data;

        if (errorData?.message) {
            if (typeof errorData.message === "object") {
                message = Object.values(errorData.message).flat().join(", ");
            } else {
                message = errorData.message;
            }
        } else if (err.message) {
            message = err.message;
        }

        return {
            success: false,
            message,
        };
    }
}

export async function completeSubscription(
    tx_ref: string,
    paymentMethod?: string
) {
    try {
        const [transaction] = await db
            .update(transactions)
            .set({
                status: "completed",
                payment_method: paymentMethod,
                updated_at: new Date(),
            })
            .where(eq(transactions.tx_ref, tx_ref))
            .returning();

        if (!transaction) {
            error(`Transaction not found for tx_ref: ${tx_ref}`);
            return { success: false, message: "Transaction not found" };
        }

        // Upgrade user subscription
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);

        const [user] = await db
            .update(users)
            .set({
                subscription_status: "pro",
                subscription_expiry: expiryDate,
            })
            .where(eq(users.user_id, transaction.user_id))
            .returning();

        if (user) {
            info(
                `User ${user.user_id} upgraded to Premium via tx_ref: ${tx_ref}`
            );

            // Create notification
            await createNotification({
                userId: user.user_id,
                eventType: "subscription",
                message:
                    "Welcome to CourseHub Premium! Your payment was successful.",
                link: "/dashboard/settings",
            });

            // Send email
            if (user.email) {
                const displayName = user.first_name || "Student";
                await sendEmail({
                    to: user.email,
                    subject: "Welcome to CourseHub Premium!",
                    text: `Hi ${displayName},\n\nYour payment was successful and your account has been upgraded to Premium!`,
                    html: premiumWelcomeEmailTemplate(displayName),
                });
            }
        }

        return { success: true };
    } catch (err) {
        error("Error in completeSubscription:", err);
        return { success: false, message: "Failed to complete subscription" };
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
