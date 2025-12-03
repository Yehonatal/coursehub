import mongoose, { Schema, model } from "mongoose";

// Raw events for analytics pipelines
const EventSchema = new Schema(
    {
        event_id: { type: String, required: true, unique: true }, // For idempotency
        type: { type: String, required: true }, // rating | comment | view | upload
        resource_id: { type: String, required: true },
        user_id: { type: String, required: true },
        payload: { type: Object, required: true },
        created_at: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Aggregated resource analytics
const ResourceStatsSchema = new Schema(
    {
        resource_id: { type: String, required: true, unique: true },
        views: { type: Number, default: 0 },
        ratings_count: { type: Number, default: 0 },
        ratings_sum: { type: Number, default: 0 },
        avg_rating: { type: Number, default: 0 },
        last_updated: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Daily Metrics
const DailyMetricsSchema = new Schema(
    {
        date: { type: String, required: true }, // "2025-01-10"
        resource_id: { type: String },
        course_code: { type: String },
        views: Number,
        downloads: Number,
        avg_rating: Number,
        updated_at: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// User Activity
const UserActivitySchema = new Schema({
    user_id: { type: String, required: true, unique: true },
    uploads: Number,
    downloads: Number,
    ratings_given: Number,
    comments_written: Number,
    score: Number, // contribution index
    last_active: Date,
});

// Search Logs
const SearchLogSchema = new Schema({
    user_id: String,
    query: String,
    results_found: Number,
    created_at: { type: Date, default: Date.now },
});

// Recommendations
const RecommendationSchema = new Schema({
    user_id: { type: String, unique: true },
    recommended_resources: [String], // list of resource_id
    generated_at: { type: Date, default: Date.now },
});

// Helpers for clean import
export const getRecommendationsModel = () =>
    mongoose.models.Recommendations ??
    model("Recommendations", RecommendationSchema);

export const getSearchLogModel = () =>
    mongoose.models.SearchLogs ?? model("SearchLogs", SearchLogSchema);

export const getUserActivityModel = () =>
    mongoose.models.UserActivity ?? model("UserActivity", UserActivitySchema);

export const getDailyMetricsModel = () =>
    mongoose.models.DailyMetrics ?? model("DailyMetrics", DailyMetricsSchema);

export const getEventsModel = () =>
    mongoose.models.Events ?? model("Events", EventSchema);

export const getResourceStatsModel = () =>
    mongoose.models.ResourceStats ??
    model("ResourceStats", ResourceStatsSchema);
