"use server";

import { z } from "zod";
import bcrypt from "bcrypt";
import { Client } from "pg";
import { redirect } from "next/navigation";

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

async function getDbClient() {
    const connectionString = process.env.SUPABASE_DATABASE_URL;
    if (!connectionString) {
        throw new Error("SUPABASE_DATABASE_URL not configured");
    }
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    return client;
}

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
        const client = await getDbClient();
        const res = await client.query(
            "SELECT user_id, password_hash FROM users WHERE email = $1",
            [email]
        );
        await client.end();

        if (res.rowCount === 0) {
            return { success: false, message: "Invalid email or password" };
        }

        const row = res.rows[0];
        const match = await bcrypt.compare(password, row.password_hash);
        if (!match) {
            return { success: false, message: "Invalid email or password" };
        }
    } catch (err) {
        console.error("Sign in error:", err);
        return { success: false, message: "Server error" };
    }

    redirect("/user");
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

    const { firstName, lastName, email, accountType, university, password } =
        parsed.data;

    try {
        const client = await getDbClient();

        const existing = await client.query(
            "SELECT user_id FROM users WHERE email = $1",
            [email]
        );
        if (existing.rowCount !== null && existing.rowCount > 0) {
            await client.end();
            return { success: false, message: "Email already in use" };
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await client.query(
            `INSERT INTO users (first_name, last_name, email, password_hash, role, university)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                firstName,
                lastName,
                email,
                passwordHash,
                accountType,
                university || null,
            ]
        );

        await client.end();
    } catch (err) {
        console.error("Sign up error:", err);
        return { success: false, message: "Server error" };
    }

    redirect("/user");
}
