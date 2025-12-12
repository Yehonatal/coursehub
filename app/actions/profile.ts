"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { validateRequest } from "@/lib/auth/session";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ActionResponse } from "@/app/actions/auth";

const UpdateProfileSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required")
        .max(50, "First name is too long"),
    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .max(50, "Last name is too long"),
    university: z.string().max(100, "University name is too long").optional(),
    headline: z.string().max(150, "Headline is too long").optional(),
});

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
        await db
            .update(users)
            .set({
                first_name: firstName,
                last_name: lastName,
                university: normalizedUniversity,
                headline: normalizedHeadline,
            })
            .where(eq(users.user_id, user.user_id));

        revalidatePath("/", "layout");

        return {
            ...initialActionState,
            success: true,
            message: "Profile updated successfully",
        };
    } catch (err) {
        console.error("updateProfile");
        console.error(err);
        return {
            success: false,
            message: "Failed to update profile. Please try again.",
        };
    }
}
