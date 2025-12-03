import "dotenv/config";
import { connectMongo, closeMongo } from "../lib/mongodb/client";
import { getResourceStatsModel, getEventsModel } from "../lib/mongodb/models";

async function main() {
    console.log("📡 Starting MongoDB Seeder (Mongoose)...");

    try {
        await connectMongo();

        const Events = getEventsModel();
        const ResourceStats = getResourceStatsModel();

        // Sample demo analytic event
        await Events.create({
            event_id: `seed-event-${Date.now()}`,
            type: "rating",
            resource_id: "demo-resource-1",
            user_id: "demo-user-1",
            payload: { value: 5 },
        });

        // Analytics aggregation object
        const stats = await ResourceStats.findOneAndUpdate(
            { resource_id: "demo-resource-1" },
            {
                $inc: { ratings_count: 1, ratings_sum: 5 },
                $set: { last_updated: new Date() },
            },
            { new: true, upsert: true }
        );

        // recompute rating
        stats.avg_rating = stats.ratings_sum / stats.ratings_count;
        await stats.save();

        console.log("Inserted / updated resource:", stats);
    } catch (err: any) {
        console.error("❌ MongoDB seeder failed:", err.message);
        process.exitCode = 1;
    } finally {
        await closeMongo();
        console.log("✔ MongoDB Seeder finished");
    }
}

main();
