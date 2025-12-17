import { getGeminiModel } from "./gemini";
import { KNOWLEDGE_TREE_PROMPT } from "./prompts";
import { AIKnowledgeNode } from "@/types/ai";
import { extractJSONSubstring, ensureNodeDefaults } from "./helpers";

export async function generateKnowledgeTree(
    content: string,
    apiKey?: string
): Promise<AIKnowledgeNode> {
    try {
        const model = getGeminiModel(apiKey);
        const result = await model.generateContent(
            KNOWLEDGE_TREE_PROMPT + content
        );
        const response = await result.response;
        const text = response.text();

        const jsonString = extractJSONSubstring(text, false);

        let parsed: AIKnowledgeNode;
        try {
            parsed = JSON.parse(jsonString) as AIKnowledgeNode;
        } catch (e) {
            console.warn(
                "Initial parse failed for knowledge tree, retrying with reformat prompt"
            );
            try {
                const reformatPrompt = `The previous output could not be parsed as JSON. Please return ONLY a valid JSON object representing a knowledge tree in the specified format for this content:\n\n${content}`;
                const fmt = await model.generateContent(reformatPrompt);
                const fmtRes = await fmt.response;
                const fmtText = fmtRes.text();
                const fmtJSON = extractJSONSubstring(fmtText, false);
                parsed = JSON.parse(fmtJSON) as AIKnowledgeNode;
            } catch (e2) {
                console.error("Failed to reformat knowledge tree output:", e2);
                throw new Error("Failed to generate knowledge tree");
            }
        }

        // Validate and ensure defaults
        const repaired = ensureNodeDefaults(parsed as any);
        return repaired;
    } catch (error: any) {
        console.error("Error generating knowledge tree:", error);
        if (error.status === 503 || error.message?.includes("503")) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        throw new Error("Failed to generate knowledge tree");
    }
}
