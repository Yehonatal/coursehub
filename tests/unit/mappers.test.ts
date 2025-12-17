import { toIconType, mapGenerationToRecentItem } from "@/lib/ai/mappers";
import { describe, expect, test } from "vitest";

describe("mappers", () => {
    test("toIconType handles known types", () => {
        expect(toIconType("tree")).toBe("tree");
        expect(toIconType("flashcards")).toBe("question");
        expect(toIconType("flashcard")).toBe("question");
        expect(toIconType("cards")).toBe("question");
        expect(toIconType("notes")).toBe("note");
        expect(toIconType(undefined)).toBe("note");
    });

    test("mapGenerationToRecentItem produces required fields", () => {
        const gen = {
            generationType: "notes",
            title: "My Notes",
            prompt: "Summarize",
            content: { summary: "ok" },
            createdAt: new Date().toISOString(),
        };

        const item = mapGenerationToRecentItem(gen, "Tester");
        expect(item.title).toBe("My Notes");
        expect(item.type).toBe("Note");
        expect(item.iconType).toBe("note");
        expect(item.author).toBe("Tester");
        expect(item.data).toEqual(gen.content);
    });
});
