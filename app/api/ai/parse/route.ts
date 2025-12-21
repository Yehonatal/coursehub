import { NextRequest, NextResponse } from "next/server";
import { parseFile } from "@/utils/parser";
import { getCurrentUser } from "@/lib/auth/session";
import { error } from "@/lib/logger";

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("No file provided", { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const text = await parseFile(buffer, file.type, file.name);

        return NextResponse.json({ text });
    } catch (err) {
        error("Error parsing file:", err);
        const msg = err instanceof Error ? err.message : String(err);
        // Return a friendly error message that the client can display
        return NextResponse.json({
            text: `Error: ${msg || "Failed to parse file"}`,
        });
    }
}
