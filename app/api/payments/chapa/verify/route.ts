import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyTransaction } from "@/lib/payment/chapa/client";
import { error, info } from "@/lib/logger";
import { completeSubscription } from "@/app/actions/subscription";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const tx_ref =
            searchParams.get("tx_ref") || searchParams.get("trx_ref");

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
        const body = await req.json();
        const signature =
            req.headers.get("x-chapa-signature") ||
            req.headers.get("Chapa-Signature");
        const secret = process.env.CHAPA_SECRET_KEY;

        // Optional: Verify signature if secret is configured
        if (signature && secret) {
            const hash = crypto
                .createHmac("sha256", secret)
                .update(JSON.stringify(body))
                .digest("hex");

            if (hash !== signature) {
                error("Invalid Chapa signature detected");
                // We still proceed to verify with Chapa API as a fallback,
                // but we log the mismatch.
            }
        }

        const tx_ref = body.tx_ref || body.trx_ref;

        if (!tx_ref) {
            return NextResponse.json(
                { error: "tx_ref is required" },
                { status: 400 }
            );
        }

        info(`Processing Chapa webhook for tx_ref: ${tx_ref}`);

        // Verify with Chapa API (Source of Truth)
        const verification = await verifyTransaction(tx_ref);

        if (
            verification.status === "success" &&
            verification.data.status === "success"
        ) {
            const result = await completeSubscription(
                tx_ref,
                verification.data.method || body.payment_method
            );

            if (result.success) {
                return NextResponse.json({
                    success: true,
                    message: "Payment confirmed",
                });
            }
        }

        // Handle failed or cancelled status
        const chapaStatus = verification.data?.status || body.status;
        if (chapaStatus === "failed" || chapaStatus === "failed/cancelled") {
            await db
                .update(transactions)
                .set({ status: "failed", updated_at: new Date() })
                .where(eq(transactions.tx_ref, tx_ref));

            return NextResponse.json(
                { message: "Payment marked as failed", status: chapaStatus },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { message: "Webhook received", status: chapaStatus },
            { status: 200 }
        );
    } catch (err: any) {
        error("Payment webhook error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
