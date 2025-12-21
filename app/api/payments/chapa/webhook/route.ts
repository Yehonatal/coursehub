import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyTransaction } from "@/lib/payment/chapa/client";
import { error, info } from "@/lib/logger";
import { createNotification } from "@/app/actions/notifications";
import { sendEmail } from "@/lib/email/client";
import { premiumWelcomeEmailTemplate } from "@/lib/email/templates";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { tx_ref, status } = body;

        info(`Chapa webhook received for tx_ref: ${tx_ref}, status: ${status}`);

        if (status !== "success") {
            await db
                .update(transactions)
                .set({ status: "failed", updated_at: new Date() })
                .where(eq(transactions.tx_ref, tx_ref));
            return NextResponse.json({ message: "Transaction failed" });
        }

        // Verify with Chapa to be sure
        const verification = await verifyTransaction(tx_ref);

        if (
            verification.status === "success" &&
            verification.data.status === "success"
        ) {
            // Update transaction status
            const [transaction] = await db
                .update(transactions)
                .set({
                    status: "completed",
                    payment_method: verification.data.method,
                    updated_at: new Date(),
                })
                .where(eq(transactions.tx_ref, tx_ref))
                .returning();

            if (transaction) {
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
            }

            return NextResponse.json({
                message: "Webhook processed successfully",
            });
        }

        return NextResponse.json(
            { error: "Verification failed" },
            { status: 400 }
        );
    } catch (err) {
        error("Chapa webhook error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
