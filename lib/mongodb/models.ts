import mongoose, { Schema, model } from "mongoose";

// AI: Chat sessions (full chat threads saved by users)
const AIChatMessageSchema = new Schema(
    {
        role: { type: String, required: true }, // user | model
        text: { type: String, required: true },
        type: { type: String, default: "text" }, // text|notes|flashcards|tree
        meta: { type: Object },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const AIChatSessionSchema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        resourceId: { type: String, default: null, index: true },
        title: { type: String },
        messages: { type: [AIChatMessageSchema], default: [] },
        contextSnippet: { type: String },
        saved: { type: Boolean, default: false, index: true },
        messageCount: { type: Number, default: 0 },
    },
    { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// AI: discrete generated artifacts (notes, flashcards, trees, summaries)
const AIGenerationSchema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        sessionId: { type: String, default: null, index: true },
        resourceId: { type: String, default: null, index: true },
        generationType: { type: String, required: true, index: true },
        title: { type: String },
        prompt: { type: String },
        content: { type: Object, required: true },
        model: { type: String },
        apiKeySource: {
            type: String,
            enum: ["user", "server"],
            default: "server",
        },
        tokens: { type: Object, default: null },
        saved: { type: Boolean, default: false, index: true },
        viewedCount: { type: Number, default: 0 },
        generationStatus: { type: String, default: "succeeded" },
        errorMessage: { type: String, default: null },
    },
    { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const getAIChatSessionsModel = () =>
    mongoose.models.AIChatSessions ??
    model("AIChatSessions", AIChatSessionSchema);

export const getAIGenerationsModel = () =>
    mongoose.models.AIGenerations ?? model("AIGenerations", AIGenerationSchema);
