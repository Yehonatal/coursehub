import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyTransaction } from "@/lib/payment/chapa/client";
import { error, info } from "@/lib/logger";
import { completeSubscription } from "@/app/actions/subscription";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { tx_ref, status } = body;

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
        // Always return 200 to Chapa to stop retries
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
