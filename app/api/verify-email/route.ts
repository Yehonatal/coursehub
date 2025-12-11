import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const tokens = await db
        .select()
        .from(verificationTokens)
        .where(eq(verificationTokens.token, token));

    if (tokens.length === 0) {
        return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const verificationToken = tokens[0];

    if (Date.now() > verificationToken.expires_at.getTime()) {
        return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    await db
        .update(users)
        .set({ is_verified: true })
        .where(eq(users.user_id, verificationToken.user_id));

    await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.token, token));

    return NextResponse.redirect(new URL("/login?verified=true", request.url));
}
