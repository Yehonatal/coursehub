import "dotenv/config";
import { connectMongo, closeMongo } from "../lib/mongodb/client";
import {
    getAIChatSessionsModel,
    getAIGenerationsModel,
} from "../lib/mongodb/models";

async function setup() {
    await connectMongo();

    // registers all collections & indexes
    await Promise.all([
        // AI models
        getAIChatSessionsModel().init(),
        getAIGenerationsModel().init(),
    ]);

    console.log("✔ All MongoDB collections and indexes initialized");
    await closeMongo();
}

setup();
