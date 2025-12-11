"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession, invalidateSession } from "@/lib/auth/session";
import { uploadFile } from "@/lib/storage/upload";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
            return {
                success: false,
                message: "Please verify your email before logging in.",
            };
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
                const path = `school-ids/${Date.now()}-${schoolIdFile.name}`;
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

        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const verificationUrl = `${baseUrl}/api/verify-email?token=${token}`;

        await resend.emails.send({
            from: "CourseHub <onboarding@resend.dev>",
            to: email,
            subject: "Verify your CourseHub account",
            html: `
                <h1>Welcome to CourseHub!</h1>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="${verificationUrl}">Verify Email</a>
                <p>Or copy and paste this link: ${verificationUrl}</p>
            `,
        });
    } catch (err) {
        console.error("Sign up error:", err);
        return { success: false, message: "Server error" };
    }

    redirect("/verify-email");
}

export async function signOut() {
    await invalidateSession();
    redirect("/login");
}
