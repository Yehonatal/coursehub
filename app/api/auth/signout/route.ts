import { NextResponse } from "next/server";
import { invalidateSession } from "@/lib/auth/session";

export async function POST() {
    try {
        await invalidateSession();
        // Return 200 OK
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("API signout failed:", err);
        return NextResponse.json(
            { success: false, message: "Sign out failed" },
            { status: 500 }
        );
    }
}
