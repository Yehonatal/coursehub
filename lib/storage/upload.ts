import { supabaseAdmin } from "@/lib/supabase/client";
import { error } from "@/lib/logger";

export async function uploadFile(file: File, path: string) {
    if (!supabaseAdmin) throw new Error("Supabase not configured");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error: uploadError } = await supabaseAdmin.storage
        .from("coursebucket")
        .upload(path, buffer, {
            contentType: file.type,
            upsert: true,
        });

    if (uploadError) {
        error("Upload failed:", uploadError);
        throw new Error("Upload failed. Please try again later.");
    }

    const { data: publicUrlData } = supabaseAdmin.storage
        .from("coursebucket")
        .getPublicUrl(path);

    return publicUrlData.publicUrl;
}

export async function deleteFile(path: string) {
    if (!supabaseAdmin) throw new Error("Supabase not configured");

    const { error } = await supabaseAdmin.storage
        .from("coursebucket")
        .remove([path]);

    if (error) {
        console.error("Delete failed:", error);
        throw new Error("Failed to delete file.");
    }
}
