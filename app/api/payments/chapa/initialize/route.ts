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
        const {
            amount,
            currency = "ETB",
            return_url: custom_return_url,
        } = body;

        if (!amount) {
            return NextResponse.json(
                { error: "Amount is required" },
                { status: 400 }
            );
        }

        const tx_ref = `coursehub-${crypto.randomUUID()}`;

        // Save transaction to DB
        await db.insert(transactions).values({
            user_id: user.user_id,
            tx_ref,
            amount: amount.toString(),
            currency,
            status: "pending",
        });

        // Use request origin for dynamic environments (preview/prod)
        const origin = req.nextUrl.origin;
        const callback_url = `${origin}/api/payments/chapa/webhook`;
        const return_url =
            custom_return_url ||
            `${origin}/dashboard/settings?payment=verifying&tx_ref=${tx_ref}`;

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
                description: "Payment for CourseHub services",
            },
        });

        if (response.status === "success" && response.data?.checkout_url) {
            return NextResponse.json(response);
        } else {
            let details = response.message || "Failed to initialize payment";
            if (typeof details === "object") {
                details = Object.values(details).flat().join(", ");
            }
            return NextResponse.json(
                {
                    error: "Failed to initialize payment",
                    details,
                },
                { status: 400 }
            );
        }
    } catch (err: any) {
        error("Payment initialization error:", err);

        let details = err.message || "Failed to initialize payment";
        const errorData = err.response?.data;

        if (errorData?.message) {
            if (typeof errorData.message === "object") {
                details = Object.values(errorData.message).flat().join(", ");
            } else {
                details = errorData.message;
            }
        }

        return NextResponse.json(
            {
                error: "Failed to initialize payment",
                details,
            },
            { status: 500 }
        );
    }
}
