import { GoogleGenerativeAI } from "@google/generative-ai";
import { debug } from "@/lib/logger";

const defaultApiKey = process.env.GEMINI_API;

// If gemini-2.5-flash-lite
export const DEFAULT_MODEL_NAME = "gemini-2.5-flash-lite";

export function getGeminiModel(apiKey?: string, modelName?: string) {
    const key = apiKey || defaultApiKey;
    if (!key) {
        throw new Error(
            "Missing Gemini API Key. Please provide one in settings or set GEMINI_API env var."
        );
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
