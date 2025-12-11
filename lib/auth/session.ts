import { cookies } from "next/headers";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { eq } from "drizzle-orm";

const SESSION_COOKIE_NAME = "session_id";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function createSession(userId: string) {
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    await db.insert(sessions).values({
        session_id: sessionId,
        user_id: userId,
        expires_at: expiresAt,
    });

    (await cookies()).set(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/",
    });
}

export async function validateRequest() {
    const sessionId = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    if (!sessionId) return { user: null, session: null };

    const result = await db
        .select({ user: users, session: sessions })
        .from(sessions)
        .innerJoin(users, eq(sessions.user_id, users.user_id))
        .where(eq(sessions.session_id, sessionId));

    if (result.length < 1) {
        return { user: null, session: null };
    }

    const { user, session } = result[0];

    if (Date.now() >= session.expires_at.getTime()) {
        await db.delete(sessions).where(eq(sessions.session_id, sessionId));
        return { user: null, session: null };
    }

    return { user, session };
}

export async function invalidateSession() {
    const sessionId = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    if (sessionId) {
        await db.delete(sessions).where(eq(sessions.session_id, sessionId));
    }
    (await cookies()).delete(SESSION_COOKIE_NAME);
}
