import { getGeminiModel } from "./gemini";
import { FLASHCARDS_PROMPT, KNOWLEDGE_TREE_PROMPT } from "./prompts";
import { AIFlashcard, AIKnowledgeNode } from "@/types/ai";

function extractJSONSubstring(text: string, expectArray = true) {
    // Strip surrounding markdown fences
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();

    // If it already looks like valid JSON, return it
    try {
        JSON.parse(cleaned);
        return cleaned;
    } catch (e) {
        // Fall through to heuristics
    }

    // Heuristic: find first '[' and last ']' for arrays, or first '{' and last '}' for objects
    if (expectArray) {
        const first = cleaned.indexOf("[");
        const last = cleaned.lastIndexOf("]");
        if (first !== -1 && last !== -1 && last > first) {
            return cleaned.substring(first, last + 1);
        }
    } else {
        const first = cleaned.indexOf("{");
        const last = cleaned.lastIndexOf("}");
        if (first !== -1 && last !== -1 && last > first) {
            return cleaned.substring(first, last + 1);
        }
    }

    // As a last resort return the cleaned text and let JSON.parse fail upstream
    return cleaned;
}

function ensureNodeDefaults(node: any): AIKnowledgeNode {
    const id =
        node.id ||
        (node.label ? node.label.toLowerCase().replace(/\s+/g, "_") : "root");
    const label = node.label || node.id || "Root";
    const description = node.description || undefined;
    const children = Array.isArray(node.children)
        ? node.children.map((c: any) => ensureNodeDefaults(c))
        : [];
    return { id, label, description, children };
}

export async function generateFlashcards(
    content: string,
    apiKey?: string
): Promise<AIFlashcard[]> {
    try {
        const model = getGeminiModel(apiKey);
        const result = await model.generateContent(FLASHCARDS_PROMPT + content);
        const response = await result.response;
        const text = response.text();

        const jsonString = extractJSONSubstring(text, true);

        let parsed: AIFlashcard[];
        try {
            parsed = JSON.parse(jsonString) as AIFlashcard[];
        } catch (e) {
            console.warn(
                "Initial parse failed for flashcards, retrying with reformat prompt"
            );
            // Ask the model to reformat into strict JSON
            try {
                const reformatPrompt = `The previous output could not be parsed as JSON. Please return ONLY a valid JSON array of flashcards in this format: [{"front":"...","back":"...","tag":"..."}] for this content:\n\n${content}`;
                const fmt = await model.generateContent(reformatPrompt);
                const fmtRes = await fmt.response;
                const fmtText = fmtRes.text();
                const fmtJSON = extractJSONSubstring(fmtText, true);
                parsed = JSON.parse(fmtJSON) as AIFlashcard[];
            } catch (e2) {
                console.error("Failed to reformat flashcards output:", e2);
                throw new Error("Failed to generate flashcards");
            }
        }

        // Repair any malformed cards: if back is missing or identical to front, try to extract or generate an answer
        const repaired: AIFlashcard[] = [];

        for (const card of parsed) {
            let front = (card.front || "").trim();
            let back = (card.back || "").trim();

            // Heuristic: if front includes an inline answer like "A: ..." or "Answer: ..." extract it
            if (back === "" || back === front) {
                const aMatch = front.match(
                    /(?:\bA\b|Answer|Ans)[:\-]\s*(.+)$/i
                );
                if (aMatch && aMatch[1]) {
                    back = aMatch[1].trim();
                    // Clean the front to remove the inline answer
                    front = front
                        .replace(/(?:\bA\b|Answer|Ans)[:\-]\s*.+$/i, "")
                        .trim();
                }
            }

            repaired.push({ front, back, tag: card.tag });
        }

        // For any remaining cards where back is empty or identical to front, call a short-answer prompt
        const needsGeneration = repaired.filter(
            (c) =>
                !c.back ||
                c.back.trim() === "" ||
                c.back.trim() === c.front.trim()
        );

        if (needsGeneration.length > 0) {
            const modelForAnswers = getGeminiModel(apiKey);
            for (const c of needsGeneration) {
                try {
                    const prompt = `Provide a concise (1-2 sentence) answer for the following flashcard front:\n\nQ: ${c.front}\n\nAnswer:`;
                    const res = await modelForAnswers.generateContent(prompt);
                    const r = await res.response;
                    const ans = r.text().trim();
                    if (ans) {
                        c.back = ans.replace(/^\s*[:\-]*/g, "").trim();
                    }
                } catch (e) {
                    console.error(
                        "Failed to generate flashcard answer for:",
                        c.front,
                        e
                    );
                }
            }
        }

        return repaired;
    } catch (error: any) {
        console.error("Error generating flashcards:", error);
        if (error.status === 503 || error.message?.includes("503")) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        throw new Error("Failed to generate flashcards");
    }
}

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
