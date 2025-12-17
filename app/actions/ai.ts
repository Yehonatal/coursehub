"use server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/db";
import { user_quotas, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { generateStudyNotes } from "@/lib/ai/summary";
import { generateFlashcards } from "@/lib/ai/flashcard";
import { generateKnowledgeTree } from "@/lib/ai/knowledgetree";
import { AIStudyNote, AIFlashcard, AIKnowledgeNode } from "@/types/ai";

import { getGeminiModel } from "@/lib/ai/gemini";

const FREE_TIER_QUOTA = 10;

async function checkQuota(userId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.user_id, userId),
    });

    if (!user) throw new Error("User not found");

    if (
        user.subscription_status === "active" ||
        user.subscription_status === "pro"
    ) {
        return true; // Unlimited for paid users
    }

    // Check quota for free users
    let quota = await db.query.user_quotas.findFirst({
        where: eq(user_quotas.user_id, userId),
    });

    if (!quota) {
        // Create quota record if not exists
        await db.insert(user_quotas).values({ user_id: userId });
        quota = {
            user_id: userId,
            ai_generations_count: 0,
            last_reset_date: new Date(),
        };
    }

    if (quota.ai_generations_count >= FREE_TIER_QUOTA) {
        throw new Error(
            "Free tier quota exceeded. Please upgrade to continue."
        );
    }

    return true;
}

async function incrementQuota(userId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.user_id, userId),
    });

    if (
        user?.subscription_status === "active" ||
        user?.subscription_status === "pro"
    ) {
        return;
    }

    await db
        .insert(user_quotas)
        .values({
            user_id: userId,
            ai_generations_count: 1,
        })
        .onConflictDoUpdate({
            target: user_quotas.user_id,
            set: {
                ai_generations_count: sql`${user_quotas.ai_generations_count} + 1`,
            },
        });
}

export async function createStudyNotes(
    content: string,
    apiKey?: string
): Promise<AIStudyNote> {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await checkQuota(user.user_id);

    const notes = await generateStudyNotes(content, apiKey);

    await incrementQuota(user.user_id);

    return notes;
}

export async function createFlashcards(
    content: string,
    apiKey?: string
): Promise<AIFlashcard[]> {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await checkQuota(user.user_id);

    const flashcards = await generateFlashcards(content, apiKey);

    await incrementQuota(user.user_id);

    return flashcards;
}

export async function createKnowledgeTree(
    content: string,
    apiKey?: string
): Promise<AIKnowledgeNode> {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await checkQuota(user.user_id);

    const tree = await generateKnowledgeTree(content, apiKey);

    await incrementQuota(user.user_id);

    return tree;
}

export async function sendChatMessage(
    history: { role: "user" | "model"; parts: string }[],
    message: string,
    context?: string,
    apiKey?: string
) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await checkQuota(user.user_id);

    try {
        const model = getGeminiModel(apiKey);

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

        await incrementQuota(user.user_id);

        return text;
    } catch (error: any) {
        console.error("Error sending chat message:", error);
        if (error.message?.includes("429") || error.status === 429) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        throw error;
    }
}
