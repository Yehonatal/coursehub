import { db } from "@/db";
import {
    user_courses,
    tasks,
    study_activities,
    resources,
    course_resources,
} from "@/db/schema";
import { eq, desc, and, inArray } from "drizzle-orm";

export async function getUserCourses(userId: string) {
    return await db.query.user_courses.findMany({
        where: eq(user_courses.user_id, userId),
        orderBy: [desc(user_courses.created_at)],
    });
}

export async function getUserTasks(userId: string) {
    return await db.query.tasks.findMany({
        where: eq(tasks.user_id, userId),
        orderBy: [desc(tasks.due_date)],
    });
}

export async function getUserResources(userId: string) {
    // Fetch resources uploaded by user
    const userUploads = await db.query.resources.findMany({
        where: eq(resources.uploader_id, userId),
        orderBy: [desc(resources.upload_date)],
        limit: 50,
    });

    return userUploads;
}

export type UserCourse = Awaited<ReturnType<typeof getUserCourses>>[number];
export type UserTask = Awaited<ReturnType<typeof getUserTasks>>[number];
export type UserResource = Awaited<ReturnType<typeof getUserResources>>[number];
