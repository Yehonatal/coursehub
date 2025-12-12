import { NextResponse } from "next/server";
import { getResourceStats } from "@/lib/resources";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const stats = await getResourceStats(id);
        return NextResponse.json({ success: true, data: stats });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
