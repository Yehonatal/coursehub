"use server";

import { z } from "zod";
import { db } from "@/db";
import {
    resources,
    verification,
    universities,
    user_quotas,
    users,
} from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { uploadFile, deleteFile } from "@/lib/storage/upload";
import { validateRequest } from "@/lib/auth/session";
import { createResource } from "@/lib/dal/resource-helpers";
import type { ActionResponse } from "@/app/actions/auth";
import { revalidatePath } from "next/cache";
import { error, warn } from "@/lib/logger";
import { slugify } from "@/utils/helpers";

export async function verifyResource(
    resourceId: string
): Promise<ActionResponse> {
    const { user } = await validateRequest();
    if (!user || user.role !== "educator") {
        return {
            success: false,
            message: "Only educators can verify resources.",
        };
    }

    if (!user.is_verified) {
        return {
            success: false,
            message:
                "Your educator account must be verified before you can verify resources.",
        };
    }

    try {
        await db.transaction(async (tx: any) => {
            // Update resource status
            await tx
                .update(resources)
                .set({ is_verified: true })
                .where(eq(resources.resource_id, resourceId));

            // Record verification
            await tx
                .insert(verification)
                .values({
                    resource_id: resourceId,
                    educator_id: user.user_id,
                    status: "verified",
                    verified_date: new Date(),
                })
                .onConflictDoUpdate({
                    target: verification.resource_id,
                    set: {
                        educator_id: user.user_id,
                        status: "verified",
                        verified_date: new Date(),
                    },
                });
        });

        revalidatePath(`/resources/${resourceId}`);
        return { success: true, message: "Resource verified successfully." };
    } catch (err) {
        error("Verify resource failed:", err);
        return { success: false, message: "Failed to verify resource." };
    }
}

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

    // Check storage quota
    const FREE_STORAGE_LIMIT = 100 * 1024 * 1024; // 100MB
    const PRO_STORAGE_LIMIT = 10 * 1024 * 1024 * 1024; // 10GB

    const userData = await db.query.users.findFirst({
        where: eq(users.user_id, user.user_id),
    });

    const isPremium =
        userData?.subscription_status === "pro" ||
        userData?.subscription_status === "active";

    const storageLimit = isPremium ? PRO_STORAGE_LIMIT : FREE_STORAGE_LIMIT;

    const quota = await db.query.user_quotas.findFirst({
        where: eq(user_quotas.user_id, user.user_id),
    });

    const currentUsage = quota?.storage_usage || 0;
    if (currentUsage + file.size > storageLimit) {
        return {
            success: false,
            message: `Storage limit exceeded. ${
                isPremium ? "Pro" : "Free"
            } tier limit is ${isPremium ? "10GB" : "100MB"}. Current usage: ${(
                currentUsage /
                (1024 * 1024)
            ).toFixed(2)}MB.`,
        };
    }

    // Validate file type and size (max 20MB per file)
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/markdown",
        "text/x-markdown",
        "text/plain",
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

        // Get university_id
        let universityId = user.university_id;

        // If a different university was provided, try to find its ID
        if (
            university &&
            university.trim() !== "" &&
            university !== user.university
        ) {
            const uniResult = await db
                .select({ university_id: universities.university_id })
                .from(universities)
                .where(eq(universities.name, university))
                .limit(1);
            if (uniResult.length > 0) {
                universityId = uniResult[0].university_id;
            } else {
                // Create university if it doesn't exist
                try {
                    const [newUni] = await db
                        .insert(universities)
                        .values({
                            name: university.trim(),
                            slug: slugify(university.trim()),
                            is_official: false,
                        })
                        .returning();
                    universityId = newUni.university_id;
                } catch (err) {
                    error("University creation error in uploadResource:", err);
                }
            }
        }

        await createResource(
            {
                uploader_id: user.user_id,
                course_code: courseCode,
                semester,
                university: uploaderUniversity,
                university_id: universityId,
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

        // Update storage usage in user_quotas
        await db
            .insert(user_quotas)
            .values({
                user_id: user.user_id,
                storage_usage: file.size,
            })
            .onConflictDoUpdate({
                target: user_quotas.user_id,
                set: {
                    storage_usage: sql`${user_quotas.storage_usage} + ${file.size}`,
                },
            });

        return {
            ...initialActionState,
            success: true,
            message: "Resource uploaded successfully",
        };
    } catch (err) {
        error("uploadResource", err);
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
            .select({
                file_url: resources.file_url,
                file_size: resources.file_size,
            })
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
            warn("Failed to delete file from storage", e);
        }

        await db.delete(resources).where(eq(resources.resource_id, resourceId));

        // Decrement storage usage
        if (resource.file_size) {
            await db
                .update(user_quotas)
                .set({
                    storage_usage: sql`GREATEST(0, ${user_quotas.storage_usage} - ${resource.file_size})`,
                })
                .where(eq(user_quotas.user_id, user.user_id));
        }

        revalidatePath("/dashboard/resources");
        revalidatePath("/dashboard");
        return { success: true, message: "Resource deleted successfully" };
    } catch (err) {
        error("Delete resource failed:", err);
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
            .select({
                resource_id: resources.resource_id,
                file_url: resources.file_url,
                university: resources.university,
                resource_type: resources.resource_type,
            })
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

        // Get university_id if university changed
        let universityId: number | undefined = undefined;
        if (university && university !== existing.university) {
            const uniResult = await db
                .select({ university_id: universities.university_id })
                .from(universities)
                .where(eq(universities.name, university))
                .limit(1);
            if (uniResult.length > 0) {
                universityId = uniResult[0].university_id;
            }
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
                university_id: universityId,
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
    } catch (err) {
        error("Update resource failed:", err);
        const errorMessage =
            err instanceof Error ? err.message : "Unknown error";
        return {
            success: false,
            message: `Failed to update resource: ${errorMessage}`,
        };
    }
}
