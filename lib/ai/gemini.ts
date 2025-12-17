import { GoogleGenerativeAI } from "@google/generative-ai";

const defaultApiKey = process.env.GEMINI_API;

// Using gemini-1.5-flash as the standard flash model.
// If gemini-2.5-flash becomes available, this string can be updated.
export const MODEL_NAME = "gemini-2.5-flash";

export function getGeminiModel(apiKey?: string) {
    const key = apiKey || defaultApiKey;
    if (!key) {
        throw new Error(
            "Missing Gemini API Key. Please provide one in settings or set GEMINI_API env var."
        );
    }
    const genAI = new GoogleGenerativeAI(key);
    return genAI.getGenerativeModel({ model: MODEL_NAME });
}

// Keep this for backward compatibility if needed, or remove if unused
export const model = defaultApiKey
    ? new GoogleGenerativeAI(defaultApiKey).getGenerativeModel({
          model: MODEL_NAME,
      })
    : null;
