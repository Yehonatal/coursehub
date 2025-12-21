"use server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/db";
import { users, resources } from "@/db/schema";
import { eq } from "drizzle-orm";
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
import { error } from "@/lib/logger";
import { checkQuota, incrementQuota } from "@/lib/ai/quota";
import { withRetry } from "@/utils/helpers";

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
    }).catch((err: any) => {
        error("Error sending chat message:", err);
        if (
            err.message?.includes("429") ||
            err.status === 429 ||
            err.message?.includes("503") ||
            err.status === 503
        ) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        throw err;
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

    // Check quota (this handles both premium and free limits)
    await checkQuota(user.user_id, "generation");

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
