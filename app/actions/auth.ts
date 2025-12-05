"use server";

import { z } from "zod";

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
    const data = Object.fromEntries(formData);
    const parsed = SignInSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    // TODO: Implement actual sign in logic
    console.log("Sign in data:", parsed.data);

    return {
        success: true,
        message: "Signed in successfully",
    };
}

export async function signUp(
    prevState: ActionResponse,
    formData: FormData
): Promise<ActionResponse> {
    const data = Object.fromEntries(formData);
    // Handle file upload separately if needed, but for validation we might need to check it
    // For now, let's assume file is handled or optional in schema for simplicity in this step

    const parsed = SignUpSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    // TODO: Implement actual sign up logic
    console.log("Sign up data:", parsed.data);

    return {
        success: true,
        message: "Account created successfully",
    };
}
