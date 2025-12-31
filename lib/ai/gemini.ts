import { GoogleGenerativeAI } from "@google/generative-ai";
import { debug } from "@/lib/logger";

const defaultApiKey = process.env.GEMINI_API;

// If gemini-2.5-flash-lite
export const DEFAULT_MODEL_NAME = "gemini-2.5-flash-lite";

export function getGeminiModel(apiKey?: string, modelName?: string) {
    const key = apiKey || defaultApiKey;
    if (!key) {
        const err = new Error(
            "Missing Gemini API Key. Please provide one in settings or set GEMINI_API env var."
        );
        (err as any).code = "AI_API_KEY_MISSING";
        throw err;
    }

    // Priority: explicit modelName -> env var GEMINI_MODEL -> default
    const model = modelName || process.env.GEMINI_MODEL || DEFAULT_MODEL_NAME;

    debug(`Using Gemini model: ${model} and key: ${key.substring(0, 4)}*** `);

    const genAI = new GoogleGenerativeAI(key);
    return genAI.getGenerativeModel({ model });
}

export const model = defaultApiKey
    ? new GoogleGenerativeAI(defaultApiKey).getGenerativeModel({
          model: process.env.GEMINI_MODEL || DEFAULT_MODEL_NAME,
      })
    : null;

export function detectApiKeyError(err: unknown): "MISSING" | "INVALID" | null {
    if (!err) return null;
    const msg = (err as any).message || String(err);
    const code = (err as any).code || "";

    if (
        code === "AI_API_KEY_MISSING" ||
        msg.includes("Missing Gemini API Key")
    ) {
        return "MISSING";
    }

    if (
        msg.includes("API key not valid") ||
        msg.includes("API_KEY_INVALID") ||
        (msg.includes("API key") && msg.includes("not valid"))
    ) {
        return "INVALID";
    }

    return null;
}
