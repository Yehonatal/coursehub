import { NextResponse } from "next/server";
import { invalidateSession } from "@/lib/auth/session";
import { error } from "@/lib/logger";

export async function POST() {
    try {
        await invalidateSession();
        // Return 200 OK
        return NextResponse.json({ success: true });
    } catch (err) {
        error("API signout failed:", err);
        return NextResponse.json(
            { success: false, message: "Sign out failed" },
            { status: 500 }
        );
    }
}
