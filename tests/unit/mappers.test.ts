import { describe, it, expect } from "vitest";
import { toIconType, mapGenerationToRecentItem, type IconType } from "../../lib/ai/mappers"; // Adjust path if needed

describe("toIconType", () => {
  it("returns 'note' as default when input is undefined, null, or empty", () => {
    expect(toIconType(undefined)).toBe("note");
    expect(toIconType(null as any)).toBe("note");
    expect(toIconType("")).toBe("note");
  });

  it("returns 'tree' for 'tree' (case insensitive)", () => {
    expect(toIconType("tree")).toBe("tree");
    expect(toIconType("Tree")).toBe("tree");
    expect(toIconType("TREE")).toBe("tree");
  });

  it("returns 'question' for flashcard-related types (case insensitive)", () => {
    const flashcardTypes = ["flashcards", "cards", "question", "flashcard"];
    flashcardTypes.forEach((type) => {
      expect(toIconType(type)).toBe("question");
      expect(toIconType(type.toUpperCase())).toBe("question");
    });
  });

  it("returns 'note' for any other input", () => {
    expect(toIconType("summary")).toBe("note");
    expect(toIconType("random")).toBe("note");
    expect(toIconType("notes")).toBe("note");
    expect(toIconType("unknown")).toBe("note");
  });
});

describe("mapGenerationToRecentItem", () => {
  it("maps study notes generation correctly", () => {
    const gen = {
      generationType: "notes",
      title: "Cell Biology Notes",
      content: { keyPoints: ["Nucleus", "Mitochondria"] },
    };

    const result = mapGenerationToRecentItem(gen);

    expect(result).toEqual({
      title: "Cell Biology Notes",
      type: "Note",
      meta: "Study Notes",
      author: "You",
      iconType: "note",
      data: gen.content,
    });
  });

  it("maps knowledge tree generation correctly", () => {
    const gen = {
      generationType: "tree",
      content: { nodes: [{ topic: "Root" }, { topic: "Child" }] },
    };

    const result = mapGenerationToRecentItem(gen);

    expect(result).toEqual({
      title: "Tree",
      type: "Knowledge Tree",
      meta: "2 Nodes",
      author: "You",
      iconType: "tree",
      data: gen.content,
    });
  });

  it("maps flashcards generation correctly", () => {
    const gen = {
      generationType: "flashcards",
      content: [{ front: "Q1", back: "A1" }, { front: "Q2", back: "A2" }],
    };

    const result = mapGenerationToRecentItem(gen);

    expect(result).toEqual({
      title: "Flashcards",
      type: "Flashcards",
      meta: "2 Cards",
      author: "You",
      iconType: "question",
      data: gen.content,
    });
  });

  it("uses prompt as title fallback when title is missing and prompt is string", () => {
    const gen = {
      generationType: "notes",
      prompt: "This is a very long prompt that should be truncated after 30 characters",
    };

    const result = mapGenerationToRecentItem(gen);

    // Fixed expectation — exactly 30 chars + "..."
    expect(result.title).toBe("This is a very long prompt tha...");
  });

  it("uses capitalized generationType as title when no title and no prompt", () => {
    const gen = {
      generationType: "tree",
    };

    const result = mapGenerationToRecentItem(gen);

    expect(result.title).toBe("Tree");
  });

  it("uses custom author when provided", () => {
    const gen = { generationType: "notes", title: "My Notes" };

    const result = mapGenerationToRecentItem(gen, "Alice");

    expect(result.author).toBe("Alice");
  });

  it("handles zero counts gracefully", () => {
    const genTree = { generationType: "tree", content: { nodes: [] } };
    const genCards = { generationType: "flashcards", content: [] };

    expect(mapGenerationToRecentItem(genTree).meta).toBe("0 Nodes");
    expect(mapGenerationToRecentItem(genCards).meta).toBe("0 Cards");
  });

  it("handles missing content gracefully", () => {
    const gen = { generationType: "tree" }; // no content

    const result = mapGenerationToRecentItem(gen);

    expect(result.meta).toBe("0 Nodes");
    expect(result.data).toBeUndefined();
  });
});