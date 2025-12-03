import "dotenv/config";
import { connectMongo, closeMongo } from "../lib/mongodb/client";
import {
    getEventsModel,
    getResourceStatsModel,
    getDailyMetricsModel,
    getSearchLogModel,
    getUserActivityModel,
    getRecommendationsModel,
} from "../lib/mongodb/models";

async function setup() {
    await connectMongo();

    // registers all collections & indexes
    await Promise.all([
        getEventsModel().init(),
        getResourceStatsModel().init(),
        getDailyMetricsModel().init(),
        getSearchLogModel().init(),
        getUserActivityModel().init(),
        getRecommendationsModel().init(),
    ]);

    console.log("✔ All MongoDB collections and indexes initialized");
    await closeMongo();
}

setup();
