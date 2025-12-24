import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyTransaction } from "@/lib/payment/chapa/client";
import { error, info } from "@/lib/logger";
import { completeSubscription } from "@/app/actions/subscription";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get("x-chapa-signature");
        const secret =
            process.env.CHAPA_WEBHOOK_SECRET || process.env.ENCRYPTION_KEY;

        if (!secret) {
            error("CHAPA_WEBHOOK_SECRET is not set");
            return NextResponse.json(
                { error: "Configuration error" },
                { status: 500 }
            );
        }

        // Verify signature
        const hash = crypto
            .createHmac("sha256", secret)
            .update(rawBody)
            .digest("hex");

        if (hash !== signature) {
            error("Invalid Chapa webhook signature", {
                received: signature,
                expected: hash,
            });
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 401 }
            );
        }

        const body = JSON.parse(rawBody);
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
            const result = await completeSubscription(
                tx_ref,
                verification.data.method
            );

            if (result.success) {
                return NextResponse.json({
                    message: "Webhook processed successfully",
                });
            }
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
