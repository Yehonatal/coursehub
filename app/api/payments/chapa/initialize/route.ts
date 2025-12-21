import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth/session";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { genTxRef, initializeTransaction } from "@/lib/payment/chapa/client";
import { error } from "@/lib/logger";

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
        const { amount, currency = "ETB", return_url } = body;

        if (!amount) {
            return NextResponse.json(
                { error: "Amount is required" },
                { status: 400 }
            );
        }

        const tx_ref = await genTxRef({ prefix: "CH", size: 15 });

        // Save transaction to DB
        await db.insert(transactions).values({
            user_id: user.user_id,
            tx_ref,
            amount: amount.toString(),
            currency,
            status: "pending",
        });

        const callback_url = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/chapa/webhook`;

        const response = await initializeTransaction({
            first_name: user.first_name || "User",
            last_name: user.last_name || "Student",
            email: user.email,
            amount: amount.toString(),
            currency,
            tx_ref,
            callback_url,
            return_url:
                return_url ||
                `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
        });

        if (response.status === "success" && response.data?.checkout_url) {
            return NextResponse.json(response);
        } else {
            return NextResponse.json(
                {
                    error: "Failed to initialize payment",
                    details: response.message,
                },
                { status: 400 }
            );
        }
    } catch (err: any) {
        error("Payment initialization error:", err);
        return NextResponse.json(
            {
                error: "Failed to initialize payment",
                details: err.response?.data?.message || err.message,
            },
            { status: 500 }
        );
    }
}
