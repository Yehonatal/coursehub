import { cookies } from "next/headers";
import { cache } from "react";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { withRetry } from "@/lib/db/utils";

const SESSION_COOKIE_NAME = "session_id";
// Session duration in milliseconds. Configurable via SESSION_DURATION_MS env var. Defaults to 7 days.
const SESSION_DURATION_MS =
    process.env.SESSION_DURATION_MS &&
    !isNaN(Number(process.env.SESSION_DURATION_MS))
        ? Number(process.env.SESSION_DURATION_MS)
        : 1000 * 60 * 60 * 24 * 7;

export async function createSession(userId: string) {
    if (!db) {
        console.error(
            "createSession: DB client not initialized (SUPABASE_DATABASE_URL?)"
        );
        throw new Error("Database not initialized");
    }

    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    try {
        await withRetry(async () => {
            await db.insert(sessions).values({
                session_id: sessionId,
                user_id: userId,
                expires_at: expiresAt,
            });
        });
    } catch (err) {
        console.error("createSession: DB insert failed:", err);
        throw err;
    }

    (await cookies()).set(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        expires: expiresAt,
        path: "/",
    });
}

export const validateRequest = cache(async () => {
    try {
        if (!db) {
            // DB not ready — log and return unauthenticated (don't throw).
            console.warn(
                "validateRequest: DB client not initialized; returning unauthenticated"
            );
            return { user: null, session: null };
        }

        const sessionId = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
        if (!sessionId) return { user: null, session: null };

        const result = await withRetry(async () => {
            return await db
                .select({ user: users, session: sessions })
                .from(sessions)
                .innerJoin(users, eq(sessions.user_id, users.user_id))
                .where(eq(sessions.session_id, sessionId));
        });

        if (!result || result.length < 1) {
            return { user: null, session: null };
        }

        const { user, session } = result[0];
        const expiresAt =
            session.expires_at instanceof Date
                ? session.expires_at
                : new Date(session.expires_at);

        if (Date.now() >= expiresAt.getTime()) {
            try {
                await withRetry(async () => {
                    await db
                        .delete(sessions)
                        .where(eq(sessions.session_id, sessionId));
                });
            } catch (err) {
                console.warn(
                    "validateRequest: failed to delete expired session:",
                    err
                );
            }
            return { user: null, session: null };
        }

        // Success
        return { user, session };
    } catch (err) {
        // Catch all DB or cookie errors so SSR doesn't crash
        console.error(
            "validateRequest: unexpected error while validating session:",
            err
        );
        return { user: null, session: null };
    }
});

export async function invalidateSession() {
    try {
        const sessionId = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
        if (sessionId && db) {
            try {
                await withRetry(async () => {
                    await db
                        .delete(sessions)
                        .where(eq(sessions.session_id, sessionId));
                });
            } catch (err) {
                console.error(
                    "invalidateSession: failed to delete session from DB:",
                    err
                );
            }
        }
    } catch (err) {
        console.warn("invalidateSession: error reading cookies:", err);
    } finally {
        // Always attempt to clear cookie locally
        try {
            (await cookies()).delete(SESSION_COOKIE_NAME);
        } catch (err) {
            console.warn("invalidateSession: error deleting cookie:", err);
        }
    }
}

/**
 * Convenience helper to return the current user server-side.
 * Returns the `user` object from `validateRequest()` or `null`.
 */
export async function getCurrentUser() {
    const { user } = await validateRequest();
    return user;
}
