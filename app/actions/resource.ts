"use server";

import { z } from "zod";
import { db } from "@/db";
import { resources } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { uploadFile, deleteFile } from "@/lib/storage/upload";
import { validateRequest } from "@/lib/auth/session";
import { createResource } from "@/lib/dal/resource-helpers";
import type { ActionResponse } from "@/app/actions/auth";
import { revalidatePath } from "next/cache";

const UploadResourceSchema = z.object({
    title: z.string().trim().min(1).max(255),
    courseCode: z.string().trim().min(1).max(20),
    semester: z.string().trim().min(1).max(30),
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
    isAi: z.string().optional(),
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
        isAi,
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
                is_ai: isAi === "true",
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

export async function deleteResource(
    resourceId: string
): Promise<ActionResponse> {
    const { user } = await validateRequest();
    if (!user) {
        return { success: false, message: "Unauthorized" };
    }

    try {
        const [resource] = await db
            .select({ file_url: resources.file_url })
            .from(resources)
            .where(
                and(
                    eq(resources.resource_id, resourceId),
                    eq(resources.uploader_id, user.user_id)
                )
            );

        if (!resource) {
            return {
                success: false,
                message: "Resource not found or unauthorized",
            };
        }

        // Attempt to delete file from storage
        try {
            const url = new URL(resource.file_url);
            const pathParts = url.pathname.split("/coursebucket/");
            if (pathParts.length > 1) {
                await deleteFile(pathParts[1]);
            }
        } catch (e) {
            console.error("Failed to delete file from storage", e);
        }

        await db.delete(resources).where(eq(resources.resource_id, resourceId));

        revalidatePath("/dashboard/resources");
        return { success: true, message: "Resource deleted successfully" };
    } catch (error) {
        console.error("Delete resource failed:", error);
        return { success: false, message: "Failed to delete resource" };
    }
}

export async function updateResource(
    _prevState: ActionResponse,
    formData: FormData
): Promise<ActionResponse> {
    try {
        const { user } = await validateRequest();
        if (!user) {
            return { success: false, message: "Unauthorized" };
        }

        const resourceId = formData.get("resourceId") as string;
        if (!resourceId) {
            return { success: false, message: "Resource ID is required" };
        }

        // Manually construct the object for validation to avoid File objects
        const raw: Record<string, any> = {};
        formData.forEach((value, key) => {
            if (key !== "file" && typeof value === "string") {
                raw[key] = value;
            }
        });

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

        const [existing] = await db
            .select({ resource_id: resources.resource_id })
            .from(resources)
            .where(
                and(
                    eq(resources.resource_id, resourceId),
                    eq(resources.uploader_id, user.user_id)
                )
            );

        if (!existing) {
            return {
                success: false,
                message: "Resource not found or unauthorized",
            };
        }

        // Handle optional replacement file
        const file = formData.get("file") as File | null;
        let publicUrl: string | undefined = undefined;
        let mimeType: string | undefined = undefined;
        let fileSize: number | undefined = undefined;

        if (file && file.size > 0) {
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

            const sanitizedFilename = file.name.replace(
                /[^a-zA-Z0-9.\-_]/g,
                "_"
            );
            const path = `resources/${
                user.user_id
            }/${Date.now()}-${sanitizedFilename}`;
            publicUrl = await uploadFile(file, path);
            mimeType = file.type;
            fileSize = file.size;

            // Delete old file from storage if possible
            try {
                const url = new URL(existing.file_url);
                const pathParts = url.pathname.split("/coursebucket/");
                if (pathParts.length > 1) {
                    await deleteFile(pathParts[1]);
                }
            } catch (e) {
                warn("Failed to delete previous file from storage", e);
            }
        }

        await db
            .update(resources)
            .set({
                title,
                course_code: courseCode,
                semester,
                university: university || existing.university,
                description: description || null,
                resource_type: resourceType || existing.resource_type,
                tags: tags || null,
                ...(publicUrl ? { file_url: publicUrl } : {}),
                ...(mimeType ? { mime_type: mimeType } : {}),
                ...(fileSize ? { file_size: fileSize } : {}),
            })
            .where(eq(resources.resource_id, resourceId));

        revalidatePath(`/dashboard/resources/${resourceId}`);
        return { success: true, message: "Resource updated successfully" };
    } catch (error) {
        console.error("Update resource failed:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return {
            success: false,
            message: `Failed to update resource: ${errorMessage}`,
        };
    }
}
