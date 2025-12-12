"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, verificationTokens, passwordResetTokens } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { createSession, invalidateSession } from "@/lib/auth/session";
import { uploadFile } from "@/lib/storage/upload";
import { sendEmail } from "@/lib/email/client";
import {
    verificationEmailTemplate,
    passwordResetEmailTemplate,
} from "@/lib/email/templates";
import { headers } from "next/headers";

const SignInSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

const SignUpSchema = z
    .object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z
            .string()
            .min(1, "Email is required")
            .email("Invalid email format"),
        accountType: z.enum(["student", "educator"]),
        university: z.string().optional(),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

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

    try {
        const existingUsers = await db
            .select()
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
        console.error("Sign in error:", err);
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

    try {
        const existingUsers = await db
            .select()
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
        if (schoolIdFile && schoolIdFile.size > 0) {
            try {
                // Sanitize filename to prevent path traversal or special character issues
                const sanitizedFilename = schoolIdFile.name.replace(
                    /[^a-zA-Z0-9.-]/g,
                    "_"
                );
                const path = `school-ids/${Date.now()}-${sanitizedFilename}`;
                schoolIdUrl = await uploadFile(schoolIdFile, path);
            } catch (error) {
                console.error("File upload error:", error);
                return {
                    success: false,
                    message: "Failed to upload school ID. Please try again.",
                };
            }
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const [newUser] = await db
            .insert(users)
            .values({
                first_name: firstName,
                last_name: lastName,
                email,
                password_hash: passwordHash,
                role: accountType,
                university: university || null,
                school_id_url: schoolIdUrl || null,
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
            console.warn(
                "Failed to send verification email for %s: %o",
                email,
                emailResult?.error || emailResult
            );
        }
        // In development, log verification link to console so we can test quickly if email sending is blocked
        if (process.env.NODE_ENV !== "production") {
            console.debug(
                `Dev verification link for ${email}: ${verificationUrl}`
            );
        }

        await createSession(newUser.user_id);
    } catch (err) {
        console.error("Sign up error:", err);
        return { success: false, message: "Server error" };
    }

    redirect("/dashboard?registered=true");
}

export async function signOut() {
    await invalidateSession();
    return { success: true };
}

const ForgotPasswordSchema = z.object({
    email: z.string().email("Invalid email format"),
});

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
            .select()
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
        console.error("Forgot password error:", err);
        return { success: false, message: "Server error" };
    }
}

const ResetPasswordSchema = z
    .object({
        token: z.string().min(1, "Token is required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

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
            .select()
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
        console.error("Reset password error:", err);
        return { success: false, message: "Server error" };
    }
}
