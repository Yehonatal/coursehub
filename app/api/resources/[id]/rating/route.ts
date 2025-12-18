import { NextResponse } from "next/server";
import { db } from "@/db";
import { ratings, resources } from "@/db/schema";
import { validateRequest } from "@/lib/auth/session";
import { eq, and, avg, count } from "drizzle-orm";
import { createNotification } from "@/app/actions/notifications";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        // aggregate
        const agg = await db
            .select({
                average: avg(ratings.value),
                count: count(ratings.rating_id),
            })
            .from(ratings)
            .where(eq(ratings.resource_id, id))
            .groupBy(ratings.resource_id);

        const average = agg[0]
            ? parseFloat(agg[0].average?.toString() || "0")
            : 0;
        const countVal = agg[0] ? Number(agg[0].count || 0) : 0;

        // user-specific rating if authenticated
        const { user } = await validateRequest();
        let userRating: number | null = null;
        if (user) {
            const rows = await db
                .select({ value: ratings.value })
                .from(ratings)
                .where(
                    and(
                        eq(ratings.resource_id, id),
                        eq(ratings.user_id, user.user_id)
                    )
                );
            if (rows.length > 0) userRating = rows[0].value;
        }

        return NextResponse.json({
            success: true,
            data: { average, count: countVal, userRating },
        });
    } catch (err) {
        console.error("GET rating failed:", err);
        return NextResponse.json(
            { success: false, message: "Failed to fetch rating" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { user } = await validateRequest();
    if (!user) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const body = await request.json().catch(() => ({}));
    const value = Number(body?.value);

    if (!Number.isInteger(value) || value < 1 || value > 5) {
        return NextResponse.json(
            { success: false, message: "Invalid rating value" },
            { status: 400 }
        );
    }

    try {
        // upsert
        const existing = await db
            .select({ id: ratings.rating_id })
            .from(ratings)
            .where(
                and(
                    eq(ratings.resource_id, id),
                    eq(ratings.user_id, user.user_id)
                )
            );

        if (existing.length > 0) {
            await db
                .update(ratings)
                .set({ value })
                .where(eq(ratings.rating_id, existing[0].id));
        } else {
            await db
                .insert(ratings)
                .values({ resource_id: id, user_id: user.user_id, value });

            // Trigger notification for resource owner only on new rating
            const [resource] = await db
                .select({
                    uploader_id: resources.uploader_id,
                    title: resources.title,
                })
                .from(resources)
                .where(eq(resources.resource_id, id));

            if (resource && resource.uploader_id !== user.user_id) {
                await createNotification({
                    userId: resource.uploader_id,
                    eventType: "rating",
                    message: `${user.first_name} ${user.last_name} rated your resource "${resource.title}" with ${value} stars`,
                    link: `/resources/${id}`,
                });
            }
        }

        // return updated agg
        const agg = await db
            .select({
                average: avg(ratings.value),
                count: count(ratings.rating_id),
            })
            .from(ratings)
            .where(eq(ratings.resource_id, id))
            .groupBy(ratings.resource_id);

        const average = agg[0]
            ? parseFloat(agg[0].average?.toString() || "0")
            : 0;
        const countVal = agg[0] ? Number(agg[0].count || 0) : 0;

        return NextResponse.json({
            success: true,
            data: { average, count: countVal, userRating: value },
        });
    } catch (err) {
        console.error("POST rating failed:", err);
        return NextResponse.json(
            { success: false, message: "Failed to save rating" },
            { status: 500 }
        );
    }
}
