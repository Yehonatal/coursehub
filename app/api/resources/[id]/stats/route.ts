import { NextResponse } from "next/server";
import { getResourceStats } from "@/lib/resources";
import { error } from "@/lib/logger";
import { isValidUUID } from "@/utils/helpers";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!isValidUUID(id)) {
        return NextResponse.json(
            { success: false, message: "Invalid resource ID" },
            { status: 400 }
        );
    }

    try {
        const stats = await getResourceStats(id);
        return NextResponse.json({ success: true, data: stats });
    } catch (err) {
        error("Failed to fetch stats:", err);
        return NextResponse.json(
            { success: false, message: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
