import { z } from "zod";

export const SignInSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

export const SignUpSchema = z
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

export const UploadResourceSchema = z.object({
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

export const UpdateProfileSchema = z.object({
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

export const ResetPasswordSchema = z
    .object({
        token: z.string().min(1, "Token is required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export const ChangePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(6, "New password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export const ForgotPasswordSchema = z.object({
    email: z.string().email("Invalid email format"),
});
