import { validateRequest, deleteSession } from "@/lib/auth/session";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { error } from "@/lib/logger";

export async function GET() {
    const { user } = await validateRequest();

    if (!user) {
        return NextResponse.json({ user: null });
    }

    return NextResponse.json({
        user: {
            id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            avatar_url: user.avatar_url,
        },
    });
}

export async function DELETE() {
    try {
        const { user } = await validateRequest();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Delete user from database
        // Cascade will handle resources, ratings, comments, etc.
        await db.delete(users).where(eq(users.user_id, user.user_id));

        // Clear session
        await deleteSession();

        return NextResponse.json({ success: true });
    } catch (err) {
        error("Failed to delete account:", err);
        return NextResponse.json(
            { error: "Failed to delete account" },
            { status: 500 }
        );
    }
}
