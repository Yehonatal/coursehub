import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyTransaction } from "@/lib/payment/chapa/client";
import { error, info } from "@/lib/logger";
import { completeSubscription } from "@/app/actions/subscription";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature =
            req.headers.get("x-chapa-signature") ||
            req.headers.get("chapa-signature");
        const secret = process.env.CHAPA_SECRET_KEY;

        // Optional: Verify signature if secret is available
        if (secret && signature) {
            const hash = crypto
                .createHmac("sha256", secret)
                .update(rawBody)
                .digest("hex");

            if (hash !== signature) {
                info(
                    "Webhook signature mismatch, but proceeding with verification check"
                );
            }
        }

        let body;
        try {
            body = JSON.parse(rawBody);
        } catch (e) {
            return NextResponse.json(
                { message: "Invalid JSON" },
                { status: 200 }
            );
        }

        const tx_ref = body.tx_ref || body.trx_ref;
        const status = body.status;

        if (!tx_ref) {
            return NextResponse.json({ message: "No tx_ref" }, { status: 200 });
        }

        info(`Chapa webhook received for tx_ref: ${tx_ref}, status: ${status}`);

        // Always verify with Chapa API to be safe
        const verification = await verifyTransaction(tx_ref);

        if (
            verification.status === "success" &&
            verification.data.status === "success"
        ) {
            await completeSubscription(tx_ref, verification.data.method);
            return NextResponse.json({ message: "Success" }, { status: 200 });
        }

        if (verification.data?.status === "failed" || status === "failed") {
            await db
                .update(transactions)
                .set({ status: "failed", updated_at: new Date() })
                .where(eq(transactions.tx_ref, tx_ref));
        }

        return NextResponse.json({ message: "Processed" }, { status: 200 });
    } catch (err: any) {
        error("Chapa webhook error:", err);
        return NextResponse.json({ message: "Error handled" }, { status: 200 });
    }
}

// Chapa might send GET to callback_url too
export async function GET(req: NextRequest) {
    return NextResponse.json(
        { message: "Webhook endpoint active" },
        { status: 200 }
    );
}
