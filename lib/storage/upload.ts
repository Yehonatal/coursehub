import { supabaseAdmin } from "@/lib/supabase/client";

export async function uploadFile(file: File, path: string) {
    if (!supabaseAdmin) throw new Error("Supabase not configured");

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
        .from("coursebucket")
        .upload(path, buffer, {
            contentType: file.type,
            upsert: true,
        });

    if (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
        .from("coursebucket")
        .getPublicUrl(path);

    return publicUrlData.publicUrl;
}
