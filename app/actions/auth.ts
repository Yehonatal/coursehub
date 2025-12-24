"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, verificationTokens, passwordResetTokens } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { createSession, invalidateSession } from "@/lib/auth/session";
import { warn, debug, error } from "@/lib/logger";
import { uploadFile } from "@/lib/storage/upload";
import { sendEmail } from "@/lib/email/client";
import {
    verificationEmailTemplate,
    passwordResetEmailTemplate,
    passwordChangedEmailTemplate,
} from "@/lib/email/templates";
import { headers } from "next/headers";
import { ensureUniversity } from "@/app/actions/university";
import {
    SignInSchema,
    SignUpSchema,
    ResetPasswordSchema,
    ChangePasswordSchema,
    ForgotPasswordSchema,
} from "@/lib/schemas";

export type ActionResponse = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
};

export async function signIn(
    prevState: ActionResponse,
    formData: FormData
): Promise<ActionResponse> {
    const data = Object.fromEntries(formData) as Record<string, string>;
    const parsed = SignInSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const { email, password } = parsed.data;

    if (!db) {
        return { success: false, message: "Database connection error" };
    }

    try {
        const existingUsers = await db
            .select({
                user_id: users.user_id,
                password_hash: users.password_hash,
                is_verified: users.is_verified,
            })
            .from(users)
            .where(eq(users.email, email));

        if (existingUsers.length === 0) {
            return { success: false, message: "Invalid email or password" };
        }

        const user = existingUsers[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return { success: false, message: "Invalid email or password" };
        }

        if (!user.is_verified) {
            return { success: false, message: "Email not verified" };
        }

        await createSession(user.user_id);
    } catch (err) {
        error("Sign in error:", err);
        return { success: false, message: "Server error" };
    }

    redirect("/dashboard");
}

export async function signUp(
    prevState: ActionResponse,
    formData: FormData
): Promise<ActionResponse> {
    const data = Object.fromEntries(formData) as Record<string, string>;
    const parsed = SignUpSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const { firstName, lastName, email, password, accountType, university } =
        parsed.data;
    const schoolIdFile = formData.get("schoolId") as File | null;

    if (!db) {
        return { success: false, message: "Database connection error" };
    }

    try {
        const existingUsers = await db
            .select({ user_id: users.user_id })
            .from(users)
            .where(eq(users.email, email));

        if (existingUsers.length > 0) {
            return {
                success: false,
                message: "Email already registered",
                errors: { email: ["Email already registered"] },
            };
        }

        let schoolIdUrl = "";
        let schoolIdPath = "";
        if (schoolIdFile && schoolIdFile.size > 0) {
            try {
                // Sanitize filename to prevent path traversal or special character issues
                const sanitizedFilename = schoolIdFile.name.replace(
                    /[^a-zA-Z0-9.-]/g,
                    "_"
                );
                schoolIdPath = `school-ids/${Date.now()}-${sanitizedFilename}`;
                schoolIdUrl = await uploadFile(schoolIdFile, schoolIdPath);
            } catch (err) {
                error("File upload error:", err);
                return {
                    success: false,
                    message: "Failed to upload school ID. Please try again.",
                };
            }
        }

        const [
            passwordHash,
            { university_id: universityId, name: universityName },
        ] = await Promise.all([
            bcrypt.hash(password, 12),
            ensureUniversity(university || ""),
        ]);

        const [newUser] = await db
            .insert(users)
            .values({
                first_name: firstName,
                last_name: lastName,
                email,
                password_hash: passwordHash,
                role: accountType,
                university: universityName,
                university_id: universityId,
                school_id_url: schoolIdUrl || null,
                school_id_path: schoolIdPath || null,
                is_verified: false,
            })
            .returning();

        // Create verification token
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

        await db.insert(verificationTokens).values({
            token,
            user_id: newUser.user_id,
            expires_at: expiresAt,
        });

        const headersList = await headers();
        const host = headersList.get("host");
        const protocol = headersList.get("x-forwarded-proto") || "http";
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
        const cleanBaseUrl = baseUrl.replace(/\/$/, "");
        const verificationUrl = `${cleanBaseUrl}/api/verify-email?token=${token}`;

        const emailResult = await sendEmail({
            to: email,
            subject: "Verify your CourseHub account",
            text: `Please verify your email by visiting: ${verificationUrl}`,
            html: verificationEmailTemplate(verificationUrl),
        });
        if (!emailResult?.success) {
            warn(
                "Failed to send verification email for %s: %o",
                email,
                emailResult?.error || emailResult
            );
        }
        // In development, log verification link to console so we can test quickly if email sending is blocked
        if (process.env.NODE_ENV !== "production") {
            debug(`Dev verification link for ${email}: ${verificationUrl}`);
        }

        await createSession(newUser.user_id);
    } catch (err) {
        error("Sign up error:", err);
        return { success: false, message: "Server error" };
    }

    redirect("/dashboard?registered=true");
}

export async function signOut() {
    await invalidateSession();
    return { success: true };
}

export async function forgotPassword(
    prevState: ActionResponse,
    formData: FormData
): Promise<ActionResponse> {
    const data = Object.fromEntries(formData) as Record<string, string>;
    const parsed = ForgotPasswordSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const { email } = parsed.data;

    try {
        const existingUsers = await db
            .select({ user_id: users.user_id })
            .from(users)
            .where(eq(users.email, email));

        if (existingUsers.length === 0) {
            // Don't reveal that the user doesn't exist
            return {
                success: true,
                message: "If an account exists, a reset link has been sent.",
            };
        }

        const user = existingUsers[0];
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        // Clean up old tokens
        await db
            .delete(passwordResetTokens)
            .where(eq(passwordResetTokens.user_id, user.user_id));

        await db.insert(passwordResetTokens).values({
            token,
            user_id: user.user_id,
            expires_at: expiresAt,
        });

        const headersList = await headers();
        const host = headersList.get("host");
        const protocol = headersList.get("x-forwarded-proto") || "http";
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
        const cleanBaseUrl = baseUrl.replace(/\/$/, "");
        const resetUrl = `${cleanBaseUrl}/reset-password?token=${token}`;

        await sendEmail({
            to: email,
            subject: "Reset your CourseHub password",
            text: `Reset your password by visiting: ${resetUrl}`,
            html: passwordResetEmailTemplate(resetUrl),
        });

        return {
            success: true,
            message: "If an account exists, a reset link has been sent.",
        };
    } catch (err) {
        error("Forgot password error:", err);
        return { success: false, message: "Server error" };
    }
}

export async function resetPassword(
    prevState: ActionResponse,
    formData: FormData
): Promise<ActionResponse> {
    const data = Object.fromEntries(formData) as Record<string, string>;
    const parsed = ResetPasswordSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const { token, password } = parsed.data;

    try {
        const validTokens = await db
            .select({
                user_id: passwordResetTokens.user_id,
                expires_at: passwordResetTokens.expires_at,
            })
            .from(passwordResetTokens)
            .where(
                and(
                    eq(passwordResetTokens.token, token),
                    gt(passwordResetTokens.expires_at, new Date())
                )
            );

        if (validTokens.length === 0) {
            return { success: false, message: "Invalid or expired token" };
        }

        const resetToken = validTokens[0];
        const passwordHash = await bcrypt.hash(password, 12);

        await db
            .update(users)
            .set({ password_hash: passwordHash })
            .where(eq(users.user_id, resetToken.user_id));

        // Delete the used token
        await db
            .delete(passwordResetTokens)
            .where(eq(passwordResetTokens.token, token));

        return { success: true, message: "Password reset successfully" };
    } catch (err) {
        error("Reset password error:", err);
        return { success: false, message: "Server error" };
    }
}

export async function changePassword(
    prevState: ActionResponse,
    formData: FormData
): Promise<ActionResponse> {
    const { getSession } = await import("@/lib/auth/session");
    const session = await getSession();

    if (!session) {
        return { success: false, message: "Unauthorized" };
    }

    const data = Object.fromEntries(formData) as Record<string, string>;
    const parsed = ChangePasswordSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    const { currentPassword, newPassword } = parsed.data;

    try {
        const existingUsers = await db
            .select({
                email: users.email,
                password_hash: users.password_hash,
            })
            .from(users)
            .where(eq(users.user_id, session.userId));

        if (existingUsers.length === 0) {
            return { success: false, message: "User not found" };
        }

        const user = existingUsers[0];
        const match = await bcrypt.compare(currentPassword, user.password_hash);
        if (!match) {
            return {
                success: false,
                message: "Incorrect current password",
                errors: { currentPassword: ["Incorrect current password"] },
            };
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 12);
        await db
            .update(users)
            .set({ password_hash: newPasswordHash })
            .where(eq(users.user_id, session.userId));

        // Send security notification email
        await sendEmail({
            to: user.email,
            subject: "Your CourseHub password has been changed",
            text: "Your CourseHub account password was recently changed. If you did not make this change, please contact support.",
            html: passwordChangedEmailTemplate(),
        });

        return { success: true, message: "Password updated successfully" };
    } catch (err) {
        error("Change password error:", err);
        return { success: false, message: "Server error" };
    }
}
