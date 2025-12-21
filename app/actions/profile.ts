"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { validateRequest } from "@/lib/auth/session";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ActionResponse } from "@/app/actions/auth";
import { uploadFile, deleteFile } from "@/lib/storage/upload";
import { warn, error } from "@/lib/logger";
import { UpdateProfileSchema } from "@/lib/schemas";
import { ensureUniversity } from "@/app/actions/university";

const initialActionState: ActionResponse = {
    success: false,
    message: "",
};

export async function updateProfile(
    _prevState: ActionResponse,
    formData: FormData
): Promise<ActionResponse> {
    const data = Object.fromEntries(formData) as Record<string, string>;
    const parsed = UpdateProfileSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const { firstName, lastName, university, headline } = parsed.data;
    const profileImageFile = formData.get("profileImage") as File | null;
    const bannerFile = formData.get("banner") as File | null;

    const normalizedUniversity =
        university && university.trim().length > 0 ? university.trim() : null;
    const normalizedHeadline =
        headline && headline.trim().length > 0 ? headline.trim() : null;

    const { user } = await validateRequest();
    if (!user) {
        return {
            success: false,
            message: "You must be signed in to update your profile",
        };
    }

    try {
        if (!db) {
            throw new Error("Database connection not available");
        }

        let universityId: number | null = null;
        let finalUniversityName = normalizedUniversity;

        if (normalizedUniversity) {
            const result = await ensureUniversity(normalizedUniversity);
            universityId = result.university_id;
            finalUniversityName = result.name || normalizedUniversity;
        }

        const updateData: any = {
            first_name: firstName,
            last_name: lastName,
            university: finalUniversityName,
            university_id: universityId,
            headline: normalizedHeadline,
        };

        // Handle profile image upload
        if (profileImageFile && profileImageFile.size > 0) {
            // Delete old profile image if exists
            if (user.profile_image_path) {
                try {
                    await deleteFile(user.profile_image_path);
                } catch (e) {
                    warn("Failed to delete old profile image", e);
                }
            }

            const profileImagePath = `users/${
                user.user_id
            }/profile-${Date.now()}`;
            const profileImageUrl = await uploadFile(
                profileImageFile,
                profileImagePath
            );
            updateData.profile_image_url = profileImageUrl;
            updateData.profile_image_path = profileImagePath;
        }

        // Handle banner upload
        if (bannerFile && bannerFile.size > 0) {
            // Delete old banner if exists
            if (user.banner_path) {
                try {
                    await deleteFile(user.banner_path);
                } catch (e) {
                    warn("Failed to delete old banner", e);
                }
            }

            const bannerPath = `users/${user.user_id}/banner-${Date.now()}`;
            const bannerUrl = await uploadFile(bannerFile, bannerPath);
            updateData.banner_url = bannerUrl;
            updateData.banner_path = bannerPath;
        }

        await db
            .update(users)
            .set(updateData)
            .where(eq(users.user_id, user.user_id));

        // revalidatePath("/", "layout");
        // Revalidate the root and dashboard sections so client UI updates reflect
        // the newly-saved profile fields (e.g., `ProfileHeader`, `ProfileCard`).
        // Do not pass extra args to revalidatePath; call it for every path we want
        // revalidated.
        revalidatePath("/");
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/profile");

        return {
            ...initialActionState,
            success: true,
            message: "Profile updated successfully",
        };
    } catch (err) {
        error("updateProfile failed:", err);
        return {
            success: false,
            message: "Failed to update profile. Please try again.",
        };
    }
}

export async function updateSubscriptionStatus(
    status: "free" | "premium"
): Promise<ActionResponse> {
    const { user } = await validateRequest();
    if (!user) {
        return {
            success: false,
            message: "You must be signed in to update your subscription",
        };
    }

    try {
        if (!db) {
            throw new Error("Database connection not available");
        }
        await db
            .update(users)
            .set({
                subscription_status: status,
            })
            .where(eq(users.user_id, user.user_id));

        revalidatePath("/");
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/settings");

        return {
            success: true,
            message: `Successfully updated to ${status} plan`,
        };
    } catch (err) {
        error("updateSubscriptionStatus", err);
        return {
            success: false,
            message: "Failed to update subscription status",
        };
    }
}
