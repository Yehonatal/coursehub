import { GoogleGenerativeAI } from "@google/generative-ai";

const defaultApiKey = process.env.GEMINI_API;

// Using gemini-1.5-flash as the standard flash model.
// If gemini-2.5-flash becomes available, this string can be updated.
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

    console.log(
        `Using Gemini model: ${model} and key: ${key.substring(0, 4)}*** `
    );

    const genAI = new GoogleGenerativeAI(key);
    return genAI.getGenerativeModel({ model });
}

// Keep this for backward compatibility if needed, or remove if unused
export const model = defaultApiKey
    ? new GoogleGenerativeAI(defaultApiKey).getGenerativeModel({
          model: process.env.GEMINI_MODEL || DEFAULT_MODEL_NAME,
      })
    : null;
