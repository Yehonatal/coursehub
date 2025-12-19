"use server";

import { db } from "@/db";
import { resources } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { validateRequest } from "@/lib/auth/session";
import { connectMongo } from "@/lib/mongodb/client";
import {
    getAIGenerationsModel,
    getAIChatSessionsModel,
} from "@/lib/mongodb/models";

export interface StorageStats {
    totalItems: number;
    totalSizeInBytes: number;
    storageLimitInBytes: number;
    usagePercentage: number;
    resourceCount: number;
    aiGenerationCount: number;
}

const FREE_TIER_LIMIT_MB = 100;
const BYTES_PER_MB = 1024 * 1024;

// Estimates for AI content sizes (since we don't store actual file sizes for JSON in Mongo)
const AI_SIZE_ESTIMATES = {
    notes: 50 * 1024, // 50 KB
    tree: 30 * 1024, // 30 KB
    flashcards: 20 * 1024, // 20 KB
    chat: 50 * 1024, // 50 KB per session
};

export async function getUserStorageStats(): Promise<StorageStats> {
    const { user } = await validateRequest();
    if (!user) {
        throw new Error("Unauthorized");
    }

    try {
        // 1. Get Resource Stats from PostgreSQL
        const resourceStats = await db
            .select({
                count: sql<number>`count(*)`,
                totalSize: sql<number>`sum(coalesce(${resources.file_size}, 0))`,
            })
            .from(resources)
            .where(eq(resources.uploader_id, user.user_id));

        const pgCount = Number(resourceStats[0]?.count || 0);
        const pgSize = Number(resourceStats[0]?.totalSize || 0);

        // 2. Get AI Generation Stats from MongoDB
        await connectMongo();
        const AIGeneration = getAIGenerationsModel();
        const AIChatSession = getAIChatSessionsModel();

        // Count generations by type for better estimation
        const generations = await AIGeneration.find({
            userId: user.user_id,
            saved: true,
        });
        const chatSessions = await AIChatSession.find({
            userId: user.user_id,
            saved: true,
        });

        let aiSize = 0;
        generations.forEach((gen: any) => {
            const type = (gen.generationType || "notes").toLowerCase();
            if (type === "notes") aiSize += AI_SIZE_ESTIMATES.notes;
            else if (type === "tree") aiSize += AI_SIZE_ESTIMATES.tree;
            else if (type === "flashcards" || type === "question")
                aiSize += AI_SIZE_ESTIMATES.flashcards;
            else aiSize += AI_SIZE_ESTIMATES.notes; // default
        });

        aiSize += chatSessions.length * AI_SIZE_ESTIMATES.chat;

        const aiCount = generations.length + chatSessions.length;

        // 3. Combine Stats
        const totalItems = pgCount + aiCount;
        const totalSizeInBytes = pgSize + aiSize;
        const storageLimitInBytes = FREE_TIER_LIMIT_MB * BYTES_PER_MB;
        const usagePercentage = Math.min(
            100,
            (totalSizeInBytes / storageLimitInBytes) * 100
        );

        return {
            totalItems,
            totalSizeInBytes,
            storageLimitInBytes,
            usagePercentage: parseFloat(usagePercentage.toFixed(1)),
            resourceCount: pgCount,
            aiGenerationCount: aiCount,
        };
    } catch (err) {
        console.error("Error fetching storage stats:", err);
        return {
            totalItems: 0,
            totalSizeInBytes: 0,
            storageLimitInBytes: FREE_TIER_LIMIT_MB * BYTES_PER_MB,
            usagePercentage: 0,
            resourceCount: 0,
            aiGenerationCount: 0,
        };
    }
}
