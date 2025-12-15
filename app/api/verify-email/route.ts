import { NextResponse } from "next/server";
import { db } from "@/db";
import { verificationTokens, users } from "@/db/schema";
import { eq, gt } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const token = url.searchParams.get("token");
        if (!token) {
            return NextResponse.json(
                { success: false, message: "Missing token" },
                { status: 400 }
            );
        }

        const tokens = await db
            .select({
                user_id: verificationTokens.user_id,
                expires_at: verificationTokens.expires_at,
            })
            .from(verificationTokens)
            .where(eq(verificationTokens.token, token))
            .limit(1);
        if (tokens.length === 0) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token" },
                { status: 400 }
            );
        }

        const vt = tokens[0];

        // Optionally check expires_at
        if (new Date(vt.expires_at) < new Date()) {
            return NextResponse.json(
                { success: false, message: "Expired token" },
                { status: 400 }
            );
        }

        await db
            .update(users)
            .set({ is_verified: true })
            .where(eq(users.user_id, vt.user_id));
        await db
            .delete(verificationTokens)
            .where(eq(verificationTokens.token, token));

        // Redirect to login with success param
        return NextResponse.redirect(new URL("/login?verified=true", url));
    } catch (err) {
        console.error("Verify email error:", err);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
