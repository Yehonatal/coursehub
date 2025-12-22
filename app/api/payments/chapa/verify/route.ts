import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth/session";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyTransaction } from "@/lib/payment/chapa/client";
import { error } from "@/lib/logger";
import { completeSubscription } from "@/app/actions/subscription";

export async function GET(req: NextRequest) {
    try {
        const { user } = await validateRequest();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const tx_ref = searchParams.get("tx_ref");

        if (!tx_ref) {
            return NextResponse.json(
                { error: "tx_ref is required" },
                { status: 400 }
            );
        }

        // Check DB first
        const transaction = await db.query.transactions.findFirst({
            where: eq(transactions.tx_ref, tx_ref),
        });

        if (!transaction) {
            return NextResponse.json(
                { error: "Transaction not found" },
                { status: 404 }
            );
        }

        if (transaction.user_id !== user.user_id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // If already completed in DB, return success
        if (transaction.status === "completed") {
            return NextResponse.json({
                status: "success",
                message: "Payment verified",
            });
        }

        // Otherwise verify with Chapa
        const verification = await verifyTransaction(tx_ref);

        if (
            verification.status === "success" &&
            verification.data.status === "success"
        ) {
            // Note: Webhook should have handled this, but we update here too just in case
            const result = await completeSubscription(
                tx_ref,
                verification.data.method
            );

            if (result.success) {
                return NextResponse.json({
                    status: "success",
                    message: "Payment verified",
                });
            }
        }

        return NextResponse.json({
            status: "pending",
            message: "Payment not yet completed",
        });
    } catch (err) {
        error("Payment verification error:", err);
        return NextResponse.json(
            { error: "Failed to verify payment" },
            { status: 500 }
        );
    }
}
