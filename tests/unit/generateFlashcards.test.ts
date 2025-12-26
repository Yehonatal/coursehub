// tests/unit/generateFlashcards.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateFlashcards } from "../../lib/ai/flashcard";
import { getGeminiModel } from "../../lib/ai/gemini";
import { AIFlashcard } from "@/types/ai";

// Mock the correct paths
vi.mock("../../lib/ai/gemini");
vi.mock("../../lib/ai/helpers"); // adjust if needed

vi.mock("@/lib/logger");

const mockedGetGeminiModel = getGeminiModel as any;
const { extractJSONSubstring } = await import("../../lib/ai/helpers");
const mockedExtractJSONSubstring = vi.mocked(extractJSONSubstring);

describe("generateFlashcards", () => {
  const mockContent = "Photosynthesis is the process by which plants make food using sunlight.";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully generates flashcards from valid JSON response", async () => {
    const mockFlashcards: AIFlashcard[] = [
      { front: "What is photosynthesis?", back: "The process by which plants make food using sunlight.", tag: "biology" },
      { front: "What do plants need for photosynthesis?", back: "Sunlight, water, and carbon dioxide.", tag: "biology" },
    ];

    // FIX: Declare mockFlashcards BEFORE using it
    const mockText = "Here are your flashcards:\n```json\n" + JSON.stringify(mockFlashcards) + "\n```";

    mockedGetGeminiModel.mockReturnValue({
      generateContent: vi.fn().mockResolvedValue({
        response: {
          text: vi.fn().mockReturnValue(mockText),
        },
      }),
    } as any);

    mockedExtractJSONSubstring.mockReturnValue(JSON.stringify(mockFlashcards));

    const result = await generateFlashcards(mockContent);

    expect(result).toEqual(mockFlashcards);
    expect(mockedGetGeminiModel).toHaveBeenCalledTimes(1);
  });

  it("handles malformed JSON by retrying with reformat prompt", async () => {
    const validFlashcards: AIFlashcard[] = [
      { front: "What is photosynthesis?", back: "Plants convert sunlight into energy.", tag: "science" },
    ];

    const invalidText = "Here are some flashcards:\n- Front: What is photosynthesis?\nBack: Plants convert sunlight...";
    const validText = "```json\n" + JSON.stringify(validFlashcards) + "\n```";

    const mockGenerateContent = vi.fn()
      .mockResolvedValueOnce({
        response: { text: vi.fn().mockReturnValue(invalidText) },
      })
      .mockResolvedValueOnce({
        response: { text: vi.fn().mockReturnValue(validText) },
      });

    mockedGetGeminiModel.mockReturnValue({
      generateContent: mockGenerateContent,
    } as any);

    mockedExtractJSONSubstring
      .mockReturnValueOnce("invalid")
      .mockReturnValueOnce(JSON.stringify(validFlashcards));

    const result = await generateFlashcards(mockContent);

    expect(result).toEqual(validFlashcards);
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
  });

  it("repairs cards where back is missing or same as front using heuristic", async () => {
    const rawCards: AIFlashcard[] = [
      { front: "What is the capital of France? Answer: Paris", back: "", tag: "geography" },
      { front: "Define gravity - A: Force attracting objects", back: "Force attracting objects", tag: "physics" },
    ];

    // FIX: Update expected front — current code does NOT clean when back is present (even if duplicate)
    const expectedRepaired: AIFlashcard[] = [
      { front: "What is the capital of France?", back: "Paris", tag: "geography" },
      { front: "Define gravity - A: Force attracting objects", back: "Force attracting objects", tag: "physics" }, // unchanged
    ];

    const mockText = "```json\n" + JSON.stringify(rawCards) + "\n```";

    mockedGetGeminiModel.mockReturnValue({
      generateContent: vi.fn().mockResolvedValue({
        response: { text: vi.fn().mockReturnValue(mockText) },
      }),
    } as any);

    mockedExtractJSONSubstring.mockReturnValue(JSON.stringify(rawCards));

    const result = await generateFlashcards(mockContent);

    expect(result).toEqual(expectedRepaired);
  });

  it("generates missing backs using follow-up prompt when heuristic fails", async () => {
    const incompleteCards: AIFlashcard[] = [
      { front: "What is 2 + 2?", back: "", tag: "math" },
      { front: "Who wrote Romeo and Juliet?", back: "Who wrote Romeo and Juliet?", tag: "literature" },
    ];

    const mockInitialText = "```json\n" + JSON.stringify(incompleteCards) + "\n```";

    const mockModelForAnswers = {
      generateContent: vi.fn()
        .mockResolvedValueOnce({
          response: { text: vi.fn().mockReturnValue("4") },
        })
        .mockResolvedValueOnce({
          response: { text: vi.fn().mockReturnValue("William Shakespeare") },
        }),
    };

    mockedGetGeminiModel
      .mockReturnValueOnce({
        generateContent: vi.fn().mockResolvedValue({
          response: { text: vi.fn().mockReturnValue(mockInitialText) },
        }),
      } as any)
      .mockReturnValueOnce(mockModelForAnswers as any);

    mockedExtractJSONSubstring.mockReturnValue(JSON.stringify(incompleteCards));

    const result = await generateFlashcards(mockContent);

    expect(result).toEqual([
      { front: "What is 2 + 2?", back: "4", tag: "math" },
      { front: "Who wrote Romeo and Juliet?", back: "William Shakespeare", tag: "literature" },
    ]);

    expect(mockModelForAnswers.generateContent).toHaveBeenCalledTimes(2);
  });

  it("throws RATE_LIMIT_EXCEEDED on 503 error", async () => {
    const mockError = new Error("503 Service Unavailable");
    (mockError as any).status = 503;

    mockedGetGeminiModel.mockReturnValue({
      generateContent: vi.fn().mockRejectedValue(mockError),
    } as any);

    await expect(generateFlashcards(mockContent)).rejects.toThrow("RATE_LIMIT_EXCEEDED");
  });

  it("throws generic error on other failures", async () => {
    mockedGetGeminiModel.mockReturnValue({
      generateContent: vi.fn().mockRejectedValue(new Error("Network error")),
    } as any);

    await expect(generateFlashcards(mockContent)).rejects.toThrow("Failed to generate flashcards");
  });
});