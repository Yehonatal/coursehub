import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth/session";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyTransaction } from "@/lib/payment/chapa/client";
import { error, info } from "@/lib/logger";
import { completeSubscription } from "@/app/actions/subscription";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const tx_ref = searchParams.get("tx_ref");

        if (!tx_ref) {
            return NextResponse.redirect(
                new URL("/dashboard/settings?payment=failed", req.url)
            );
        }

        // Check DB first
        const transaction = await db.query.transactions.findFirst({
            where: eq(transactions.tx_ref, tx_ref),
        });

        if (!transaction) {
            return NextResponse.redirect(
                new URL("/dashboard/settings?payment=failed", req.url)
            );
        }

        // If already completed in DB, redirect to success
        if (transaction.status === "completed") {
            return NextResponse.redirect(
                new URL("/dashboard/settings?payment=success", req.url)
            );
        }

        // Otherwise verify with Chapa
        const verification = await verifyTransaction(tx_ref);

        if (
            verification.status === "success" &&
            verification.data.status === "success"
        ) {
            const result = await completeSubscription(
                tx_ref,
                verification.data.method
            );

            if (result.success) {
                return NextResponse.redirect(
                    new URL("/dashboard/settings?payment=success", req.url)
                );
            }
        }

        // If Chapa says it failed, update our DB
        if (verification.data?.status === "failed") {
            await db
                .update(transactions)
                .set({ status: "failed", updated_at: new Date() })
                .where(eq(transactions.tx_ref, tx_ref));
        }

        return NextResponse.redirect(
            new URL("/dashboard/settings?payment=failed", req.url)
        );
    } catch (err) {
        error("Payment verification error:", err);
        return NextResponse.redirect(
            new URL("/dashboard/settings?payment=failed", req.url)
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const { user } = await validateRequest();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { tx_ref } = body;

        if (!tx_ref) {
            return NextResponse.json(
                { error: "tx_ref is required" },
                { status: 400 }
            );
        }

        // Verify with Chapa API
        const verification = await verifyTransaction(tx_ref);

        if (
            verification.status === "success" &&
            verification.data.status === "success"
        ) {
            const result = await completeSubscription(
                tx_ref,
                verification.data.method
            );

            if (result.success) {
                return NextResponse.json({
                    success: true,
                    message: "Payment confirmed",
                });
            }
        }

        if (verification.data?.status === "failed") {
            await db
                .update(transactions)
                .set({ status: "failed", updated_at: new Date() })
                .where(eq(transactions.tx_ref, tx_ref));

            return NextResponse.json(
                { error: "Payment failed", status: "failed" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                error: "Payment not yet completed",
                status: verification.data?.status,
            },
            { status: 400 }
        );
    } catch (err: any) {
        error("Payment verification error:", err);
        return NextResponse.json(
            { error: "Internal server error", details: err.message },
            { status: 500 }
        );
    }
}
