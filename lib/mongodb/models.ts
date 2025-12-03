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

// Helpers for clean import
export const getEventsModel = () =>
    mongoose.models.Events ?? model("Events", EventSchema);

export const getResourceStatsModel = () =>
    mongoose.models.ResourceStats ??
    model("ResourceStats", ResourceStatsSchema);
