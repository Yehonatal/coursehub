"use server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/db";
import { user_quotas, users, resources } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { generateStudyNotes } from "@/lib/ai/summary";
import { generateFlashcards } from "@/lib/ai/flashcard";
import { generateKnowledgeTree } from "@/lib/ai/knowledgetree";
import { AIStudyNote, AIFlashcard, AIKnowledgeNode } from "@/types/ai";

import { getGeminiModel } from "@/lib/ai/gemini";
import { connectMongo } from "@/lib/mongodb/client";
import {
    getAIChatSessionsModel,
    getAIGenerationsModel,
} from "@/lib/mongodb/models";

const FREE_GENERATIONS_LIMIT = 5;
const FREE_CHATS_LIMIT = 10;
const PRO_GENERATIONS_LIMIT = 1000;
const PRO_CHATS_LIMIT = 2000;

async function withRetry<T>(
    fn: () => Promise<T>,
    retries = 2,
    delay = 1000
): Promise<T> {
    try {
        return await fn();
    } catch (error: any) {
        const isRetryable =
            error.message?.includes("503") ||
            error.status === 503 ||
            error.message?.includes("overloaded") ||
            error.message?.includes("RATE_LIMIT_EXCEEDED");

        if (retries > 0 && isRetryable) {
            console.log(
                `AI model overloaded or rate limited, retrying... (${retries} left)`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
            return withRetry(fn, retries - 1, delay * 2);
        }
        throw error;
    }
}

async function checkQuota(userId: string, type: "generation" | "chat") {
    const user = await db.query.users.findFirst({
        where: eq(users.user_id, userId),
    });

    if (!user) throw new Error("User not found");

    const isPremium =
        user.subscription_status === "active" ||
        user.subscription_status === "pro";

    const generationLimit = isPremium
        ? PRO_GENERATIONS_LIMIT
        : FREE_GENERATIONS_LIMIT;
    const chatLimit = isPremium ? PRO_CHATS_LIMIT : FREE_CHATS_LIMIT;

    // Check quota
    let quota = await db.query.user_quotas.findFirst({
        where: eq(user_quotas.user_id, userId),
    });

    const now = new Date();
    const isNewDay =
        quota &&
        (now.getUTCDate() !== quota.last_reset_date.getUTCDate() ||
            now.getUTCMonth() !== quota.last_reset_date.getUTCMonth() ||
            now.getUTCFullYear() !== quota.last_reset_date.getUTCFullYear());

    if (!quota || isNewDay) {
        // Create or reset quota record
        await db
            .insert(user_quotas)
            .values({
                user_id: userId,
                ai_generations_count: 0,
                ai_chat_count: 0,
                last_reset_date: now,
            })
            .onConflictDoUpdate({
                target: user_quotas.user_id,
                set: {
                    ai_generations_count: 0,
                    ai_chat_count: 0,
                    last_reset_date: now,
                },
            });

        quota = {
            user_id: userId,
            ai_generations_count: 0,
            ai_chat_count: 0,
            storage_usage: quota?.storage_usage || 0,
            last_reset_date: now,
        };
    }

    if (
        type === "generation" &&
        quota.ai_generations_count >= generationLimit
    ) {
        throw new Error(
            `${
                isPremium ? "Premium" : "Free"
            } tier generation limit reached (${generationLimit}/day). Please try again tomorrow.`
        );
    }

    if (type === "chat" && quota.ai_chat_count >= chatLimit) {
        throw new Error(
            `${
                isPremium ? "Premium" : "Free"
            } tier chat limit reached (${chatLimit}/day). Please try again tomorrow.`
        );
    }

    return true;
}

async function incrementQuota(userId: string, type: "generation" | "chat") {
    await db
        .update(user_quotas)
        .set({
            ai_generations_count:
                type === "generation"
                    ? sql`${user_quotas.ai_generations_count} + 1`
                    : undefined,
            ai_chat_count:
                type === "chat"
                    ? sql`${user_quotas.ai_chat_count} + 1`
                    : undefined,
        })
        .where(eq(user_quotas.user_id, userId));
}

export async function createStudyNotes(
    content: string,
    apiKey?: string,
    model?: string
): Promise<AIStudyNote> {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await checkQuota(user.user_id, "generation");

    const notes = await withRetry(() =>
        generateStudyNotes(content, apiKey, model)
    );

    await incrementQuota(user.user_id, "generation");

    return notes;
}

export async function createFlashcards(
    content: string,
    apiKey?: string,
    model?: string
): Promise<AIFlashcard[]> {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await checkQuota(user.user_id, "generation");

    const flashcards = await withRetry(() =>
        generateFlashcards(content, apiKey, model)
    );

    await incrementQuota(user.user_id, "generation");

    return flashcards;
}

export async function createKnowledgeTree(
    content: string,
    apiKey?: string,
    model?: string
): Promise<AIKnowledgeNode> {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await checkQuota(user.user_id, "generation");

    const tree = await withRetry(() =>
        generateKnowledgeTree(content, apiKey, model)
    );

    await incrementQuota(user.user_id, "generation");

    return tree;
}

export async function sendChatMessage(
    history: { role: "user" | "model"; parts: string }[],
    message: string,
    context?: string,
    apiKey?: string,
    modelName?: string
) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await checkQuota(user.user_id, "chat");

    return await withRetry(async () => {
        const model = getGeminiModel(apiKey, modelName);

        // Ensure history starts with a user message (Gemini requirement)
        const formattedHistory = history.map((m) => ({
            role: m.role,
            parts: [{ text: m.parts }],
        }));

        while (
            formattedHistory.length > 0 &&
            formattedHistory[0].role === "model"
        ) {
            formattedHistory.shift();
        }

        const chat = model.startChat({
            history: formattedHistory,
            systemInstruction: context
                ? {
                      role: "system",
                      parts: [
                          {
                              text: `You are a helpful AI study assistant. Use the following context to answer questions:\n\n${context}`,
                          },
                      ],
                  }
                : undefined,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        await incrementQuota(user.user_id, "chat");

        return text;
    }).catch((error: any) => {
        console.error("Error sending chat message:", error);
        if (
            error.message?.includes("429") ||
            error.status === 429 ||
            error.message?.includes("503") ||
            error.status === 503
        ) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        throw error;
    });
}

// --- AI Session Management ---

export async function createChatSession(resourceId?: string, title?: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await connectMongo();
    const Session = getAIChatSessionsModel();

    const session = await Session.create({
        userId: user.user_id,
        resourceId,
        title: title || "New Chat Session",
        messages: [],
    });

    return JSON.parse(JSON.stringify(session));
}

export async function appendChatMessage(
    sessionId: string,
    message: { role: string; text: string; type?: string; meta?: any }
) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await connectMongo();
    const Session = getAIChatSessionsModel();

    const session = await Session.findOneAndUpdate(
        { _id: sessionId, userId: user.user_id },
        {
            $push: { messages: message },
            $inc: { messageCount: 1 },
        },
        { new: true }
    );

    if (!session) throw new Error("Session not found");
    return JSON.parse(JSON.stringify(session));
}

export async function saveChatSession(sessionId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await connectMongo();
    const Session = getAIChatSessionsModel();

    await Session.updateOne(
        { _id: sessionId, userId: user.user_id },
        { saved: true }
    );
}

export async function clearChatSession(sessionId: string) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await connectMongo();
    const Session = getAIChatSessionsModel();

    await Session.updateOne(
        { _id: sessionId, userId: user.user_id },
        { messages: [], messageCount: 0 }
    );
}

export async function listUserSessions(
    options: { limit?: number; skip?: number; savedOnly?: boolean } = {}
) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await connectMongo();
    const Session = getAIChatSessionsModel();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { userId: user.user_id };
    if (options.savedOnly) query.saved = true;

    const sessions = await Session.find(query)
        .sort({ updatedAt: -1 })
        .skip(options.skip || 0)
        .limit(options.limit || 20)
        .lean();

    return JSON.parse(JSON.stringify(sessions));
}

// --- AI Generation Management ---

export async function saveGeneration(payload: {
    resourceId?: string;
    sessionId?: string;
    generationType: string;
    prompt?: string;
    title?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any;
    model?: string;
    apiKeySource?: "user" | "server";
}) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    // Check if user is premium
    const userData = await db.query.users.findFirst({
        where: eq(users.user_id, user.user_id),
    });

    if (
        userData?.subscription_status !== "pro" &&
        userData?.subscription_status !== "active"
    ) {
        // Free users can save up to 5 generations per day
        const quota = await db.query.user_quotas.findFirst({
            where: eq(user_quotas.user_id, user.user_id),
        });

        if (quota && quota.ai_generations_count >= FREE_GENERATIONS_LIMIT) {
            throw new Error(
                `Daily save limit reached (${FREE_GENERATIONS_LIMIT}/day). Please upgrade to continue.`
            );
        }
    }

    await connectMongo();
    const Generation = getAIGenerationsModel();

    const generation = await Generation.create({
        userId: user.user_id,
        ...payload,
        saved: true, // Default to saved if explicitly called via "Save" button
    });

    return JSON.parse(JSON.stringify(generation));
}

export async function listUserGenerations(
    options: { limit?: number; skip?: number; type?: string } = {}
) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await connectMongo();
    const Generation = getAIGenerationsModel();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { userId: user.user_id, saved: true };
    if (options.type) query.generationType = options.type;

    const generations = await Generation.find(query)
        .sort({ createdAt: -1 })
        .skip(options.skip || 0)
        .limit(options.limit || 20)
        .lean();

    return JSON.parse(JSON.stringify(generations));
}

export async function getResourceGenerations(resourceId: string) {
    const user = await getCurrentUser();

    await connectMongo();
    const Generation = getAIGenerationsModel();

    // If user is not logged in or is free tier, they can only see their own generations
    // (which would be none since they can't save, but for safety)
    const query: Record<string, any> = {
        resourceId: resourceId,
        saved: true,
    };

    if (user) {
        const userData = await db.query.users.findFirst({
            where: eq(users.user_id, user.user_id),
        });

        const isPremium =
            userData?.subscription_status === "pro" ||
            userData?.subscription_status === "active";

        if (!isPremium) {
            query.userId = user.user_id;
        }
    } else {
        // Not logged in users see nothing
        return [];
    }

    const generations = await Generation.find(query)
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

    return JSON.parse(JSON.stringify(generations));
}

export async function getUserProfileStats() {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await connectMongo();
    const Generation = getAIGenerationsModel();

    // Aggregation for counts by type
    const typeStats = await Generation.aggregate([
        { $match: { userId: user.user_id, saved: true } },
        { $group: { _id: "$generationType", count: { $sum: 1 } } },
    ]);

    // Get uploaded resources count from Postgres (user uploads)
    const userResources = await db.query.resources.findMany({
        where: eq(resources.uploader_id, user.user_id),
    });

    // Get total resources count on the platform
    const allResources = await db.query.resources.findMany();

    // Format stats
    const stats = {
        notes: 0,
        flashcards: 0,
        trees: 0,
        uploads: userResources.length,
        totalResources: allResources.length,
    };

    typeStats.forEach((stat) => {
        if (stat._id === "notes") stats.notes = stat.count;
        if (stat._id === "flashcards") stats.flashcards = stat.count;
        if (stat._id === "tree") stats.trees = stat.count;
    });

    return stats;
}

export async function getAIAnalytics() {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await connectMongo();
    const Generation = getAIGenerationsModel();

    // Aggregation for counts by type
    const typeStats = await Generation.aggregate([
        { $match: { userId: user.user_id } },
        { $group: { _id: "$generationType", count: { $sum: 1 } } },
    ]);

    // Aggregation for daily activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyStats = await Generation.aggregate([
        {
            $match: {
                userId: user.user_id,
                createdAt: { $gte: sevenDaysAgo },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    return {
        typeStats,
        dailyStats,
    };
}
