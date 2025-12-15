import { validateRequest } from "@/lib/auth/session";
import { NextResponse } from "next/server";

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
