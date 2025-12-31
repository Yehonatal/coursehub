import { getGeminiModel } from "./gemini";
import { STUDY_NOTES_PROMPT } from "./prompts";
import { AIStudyNote } from "@/types/ai";
import { warn, error } from "@/lib/logger";

function extractJSONSubstring(text: string) {
    // Strip surrounding markdown fences
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();

    // If it already looks like valid JSON, return it
    try {
        JSON.parse(cleaned);
        return cleaned;
    } catch (e) {
        // Fall through to heuristics
    }

    // Heuristic: find first '{' and last '}' for objects
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
        return cleaned.substring(first, last + 1);
    }

    // As a last resort return the cleaned text and let JSON.parse fail upstream
    return cleaned;
}

export async function generateStudyNotes(
    content: string,
    apiKey?: string,
    modelName?: string
): Promise<AIStudyNote> {
    try {
        const model = getGeminiModel(apiKey, modelName);
        const result = await model.generateContent(
            STUDY_NOTES_PROMPT + content
        );
        const response = await result.response;
        const text = response.text();

        const jsonString = extractJSONSubstring(text);

        try {
            return JSON.parse(jsonString) as AIStudyNote;
        } catch (e) {
            warn(
                "Initial parse failed for study notes, retrying with reformat prompt"
            );
            try {
                const reformatPrompt = `The previous output could not be parsed as JSON. Please return ONLY a valid JSON object for study notes in the specified format for this content:\n\n${content}`;
                const fmt = await model.generateContent(reformatPrompt);
                const fmtRes = await fmt.response;
                const fmtText = fmtRes.text();
                const fmtJSON = extractJSONSubstring(fmtText);
                return JSON.parse(fmtJSON) as AIStudyNote;
            } catch (e2) {
                error("Failed to reformat study notes output:", e2);
                throw new Error("Failed to generate study notes");
            }
        }
    } catch (err: any) {
        error("Error generating study notes:", err);
        try {
            const { detectApiKeyError } = await import("./gemini");
            const keyIssue = detectApiKeyError(err);
            if (keyIssue === "MISSING") throw new Error("AI_API_KEY_MISSING");
            if (keyIssue === "INVALID") throw new Error("AI_API_KEY_INVALID");
        } catch (e) {
            // ignore
        }
        if (err.status === 503 || err.message?.includes("503")) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        throw new Error("Failed to generate study notes");
    }
}
