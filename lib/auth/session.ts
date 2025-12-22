import { cookies } from "next/headers";
import * as jose from "jose";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { debug, warn, error } from "@/lib/logger";

interface JWTPayload {
    userId: string;
    [key: string]: string | number | boolean | null | undefined;
}

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "VXLSt/IU3T6wyJwtJGQjZUB1NO35QekL79++R34IolY="
);

const JWT_EXPIRATION = "7d";

export async function generateJWT(payload: JWTPayload) {
    return await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRATION)
        .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jose.jwtVerify(token, JWT_SECRET);
        return payload as JWTPayload;
    } catch (err) {
        // console.error("JWT verification failed:", err);
        return null;
    }
}

export async function createSession(userId: string) {
    try {
        const token = await generateJWT({ userId });

        const cookieStore = await cookies();
        cookieStore.set({
            name: "auth_token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
            sameSite: "lax",
        });

        return true;
    } catch (err) {
        error("createSession failed:", err);
        return false;
    }
}

export async function getSession() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) return null;
        const payload = await verifyJWT(token);

        if (!payload) {
            // Token is invalid or expired, clear it to prevent repeated errors
            try {
                cookieStore.delete("auth_token");
            } catch (e) {
                // Ignore error if we can't delete (e.g. in a server component where cookies are read-only)
            }
            return null;
        }

        return payload ? { userId: payload.userId as string } : null;
    } catch (err) {
        // Handle Next.js prerendering and dynamic server usage errors gracefully
        if (err instanceof Error) {
            const msg = err.message || "";
            if (
                msg.includes("During prerendering, `cookies()` rejects") ||
                msg.includes(
                    "couldn't be rendered statically because it used `cookies`"
                ) ||
                msg.includes("Dynamic server usage")
            ) {
                debug(
                    "Cookies not available during prerendering or dynamic server usage; returning null session"
                );
                return null;
            }
        }

        error("getSession failed:", err);
        return null;
    }
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
}

// Backward compatibility wrapper for existing code
export async function validateRequest() {
    const session = await getSession();
    if (!session) return { user: null, session: null };

    try {
        if (!db) {
            warn("validateRequest: DB not initialized");
            return { user: null, session: null };
        }

        const userResult = await db
            .select()
            .from(users)
            .where(eq(users.user_id, session.userId));

        if (userResult.length === 0) {
            return { user: null, session: null };
        }

        let user = userResult[0];

        // Check if subscription expired
        if (user.subscription_status === "pro" && user.subscription_expiry) {
            const now = new Date();
            if (now > user.subscription_expiry) {
                await db
                    .update(users)
                    .set({
                        subscription_status: "free",
                        subscription_expiry: null,
                    })
                    .where(eq(users.user_id, user.user_id));

                // Update the local user object
                user = {
                    ...user,
                    subscription_status: "free",
                    subscription_expiry: null,
                };
            }
        }

        return {
            user: user,
            session: {
                session_id: "jwt",
                user_id: session.userId,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        };
    } catch (err) {
        error("Error fetching user details:", err);
        return { user: null, session: null };
    }
}

export async function invalidateSession() {
    await deleteSession();
}

export async function getCurrentUser() {
    const { user } = await validateRequest();
    return user;
}
