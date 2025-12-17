import "dotenv/config";
import { connectMongo, closeMongo } from "../lib/mongodb/client";
import { getAIGenerationsModel } from "@/lib/mongodb/models";

async function main() {
    console.log("📡 Starting MongoDB Seeder (Mongoose)...");

    try {
        await connectMongo();

        // Insert a sample AI generation tied to this resource
        try {
            const AIGenerations = getAIGenerationsModel();
            const sampleGen = await AIGenerations.create({
                userId: "demo-user-1",
                sessionId: null,
                resourceId: "demo-resource-1",
                generationType: "notes",
                title: "Study Notes - Demo Resource",
                prompt: "Intro to Demo",
                content: {
                    title: "Demo Study Notes",
                    summary: "A short summary for demo resource.",
                    keyPoints: ["Point A", "Point B"],
                    explanation: "Detailed explanation of demo content.",
                },
                model: "gemini-demo",
                apiKeySource: "server",
                saved: true,
                viewedCount: 0,
                generationStatus: "succeeded",
            });

            console.log("Inserted sample AI generation:", sampleGen);
        } catch (err: any) {
            console.warn("Failed to insert sample AI generation:", err.message);
        }
    } catch (err: any) {
        console.error("❌ MongoDB seeder failed:", err.message);
        process.exitCode = 1;
    } finally {
        await closeMongo();
        console.log("✔ MongoDB Seeder finished");
    }
}

main();
