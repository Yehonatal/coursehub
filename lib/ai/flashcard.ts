import { getGeminiModel } from "./gemini";
import { FLASHCARDS_PROMPT } from "./prompts";
import { AIFlashcard } from "@/types/ai";
import { extractJSONSubstring } from "./helpers";
import { warn, error } from "@/lib/logger";

export async function generateFlashcards(
    content: string,
    apiKey?: string,
    modelName?: string
): Promise<AIFlashcard[]> {
    try {
        const model = getGeminiModel(apiKey, modelName);
        const result = await model.generateContent(FLASHCARDS_PROMPT + content);
        const response = await result.response;
        const text = response.text();

        const jsonString = extractJSONSubstring(text, true);

        let parsed: AIFlashcard[];
        try {
            parsed = JSON.parse(jsonString) as AIFlashcard[];
        } catch (e) {
            warn(
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
                error("Failed to reformat flashcards output:", e2);
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
            const modelForAnswers = getGeminiModel(apiKey, modelName);
            for (const c of needsGeneration) {
                try {
                    const prompt = `Provide a concise (1-2 sentence) answer for the following flashcard front:\n\nQ: ${c.front}\n\nAnswer:`;
                    const res = await modelForAnswers.generateContent(prompt);
                    const r = await res.response;
                    const ans = r.text().trim();
                    if (ans) {
                        c.back = ans.replace(/^\s*[:\-]*/g, "").trim();
                    }
                } catch (err) {
                    error(
                        "Failed to generate flashcard answer for:",
                        c.front,
                        err
                    );
                }
            }
        }

        return repaired;
    } catch (err: any) {
        error("Error generating flashcards:", err);
        if (err.status === 503 || err.message?.includes("503")) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        throw new Error("Failed to generate flashcards");
    }
}
