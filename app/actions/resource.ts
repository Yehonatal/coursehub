"use server";

import { z } from "zod";
import { db } from "@/db";
import { uploadFile } from "@/lib/storage/upload";
import { validateRequest } from "@/lib/auth/session";
import { createResource } from "@/lib/dal/resource-helpers";
import type { ActionResponse } from "@/app/actions/auth";

const UploadResourceSchema = z.object({
    title: z.string().trim().min(1).max(255),
    courseCode: z.string().trim().min(1).max(10),
    semester: z.string().trim().min(1).max(10),
    university: z.string().trim().max(100).optional(),
    description: z.string().trim().max(2000).optional(),
    resourceType: z
        .string()
        .trim()
        .optional()
        .refine(
            (v) => !v || ["slides", "notes", "exam", "assignment"].includes(v),
            {
                message: "Invalid resource type",
            }
        ),
    tags: z.string().optional(), // comma-separated tags
});

const initialActionState: ActionResponse = {
    success: false,
    message: "",
};

export async function uploadResource(
    _prevState: ActionResponse,
    formData: FormData
): Promise<ActionResponse> {
    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
        return { success: false, message: "You must be signed in to upload." };
    }

    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
        return { success: false, message: "No file provided" };
    }

    // Validate file type and size (max 20MB)
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    const MAX_SIZE = 20 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
        return { success: false, message: "Unsupported file type" };
    }
    if (file.size > MAX_SIZE) {
        return { success: false, message: "File too large (max 20MB)" };
    }

    const raw = Object.fromEntries(formData) as Record<string, string>;
    const parsed = UploadResourceSchema.safeParse(raw);
    if (!parsed.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const {
        title,
        courseCode,
        semester,
        university,
        description,
        resourceType,
        tags,
    } = parsed.data;

    // Use uploader's university if none provided
    const uploaderUniversity =
        university && university.trim() !== ""
            ? university.trim()
            : user.university || null;

    try {
        if (!db) throw new Error("Database connection not available");

        // sanitize filename
        const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const path = `resources/${
            user.user_id
        }/${Date.now()}-${sanitizedFilename}`;

        const publicUrl = await uploadFile(file, path);

        const tagList = tags
            ? tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
            : [];

        if (!uploaderUniversity) {
            return { success: false, message: "University is required" };
        }

        await createResource(
            {
                uploader_id: user.user_id,
                course_code: courseCode,
                semester,
                university: uploaderUniversity,
                title,
                description: description || undefined,
                file_url: publicUrl,
                mime_type: file.type,
                file_size: file.size,
                resource_type: resourceType || undefined,
            },
            tagList
        );

        return {
            ...initialActionState,
            success: true,
            message: "Resource uploaded successfully",
        };
    } catch (err) {
        console.error("uploadResource", err);
        // Postgres error code 42703 indicates a missing column; this is
        // commonly caused by migrations that haven't been applied.
        const maybeCode = (err as { code?: string } | undefined)?.code;
        if (maybeCode === "42703") {
            return {
                success: false,
                message: "Database schema mismatch: missing column.",
            };
        }

        return {
            success: false,
            message: "Failed to upload resource. Please try again.",
        };
    }
}
