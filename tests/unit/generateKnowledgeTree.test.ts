import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateKnowledgeTree } from "../../lib/ai/knowledgetree"; // Adjust if filename is different, e.g. knowledgeTree.ts
import { getGeminiModel } from "../../lib/ai/gemini";
import { extractJSONSubstring, ensureNodeDefaults } from "../../lib/ai/helpers";

// Mock dependencies
vi.mock("../../lib/ai/gemini", () => ({
  getGeminiModel: vi.fn(),
}));

vi.mock("../../lib/ai/helpers", () => ({
  extractJSONSubstring: vi.fn(),
  ensureNodeDefaults: vi.fn(),
}));

describe("generateKnowledgeTree", () => {
  const mockGenerateContent = vi.fn();
  const mockModel = {
    generateContent: mockGenerateContent,
  };

  const mockResponse = {
    response: { text: vi.fn() },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockGenerateContent.mockResolvedValue(mockResponse);
    mockResponse.response.text.mockReturnValue(`
      Here is the knowledge tree:
      {"topic": "Photosynthesis", "summary": "Process by which plants make food", "children": []}
    `);

    vi.mocked(extractJSONSubstring).mockReturnValue(`
      {"topic": "Photosynthesis", "summary": "Process by which plants make food", "children": []}
    `);

    vi.mocked(ensureNodeDefaults).mockImplementation((node) => node); // pass-through by default

    vi.mocked(getGeminiModel).mockReturnValue(mockModel as any);
  });

  it("successfully generates a knowledge tree from valid content", async () => {
    const content = "Photosynthesis is how plants convert sunlight into energy.";

    const result = await generateKnowledgeTree(content);

    expect(result).toEqual({
      topic: "Photosynthesis",
      summary: "Process by which plants make food",
      children: [],
    });

    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockGenerateContent).toHaveBeenCalledWith(expect.stringContaining(content));
    expect(ensureNodeDefaults).toHaveBeenCalledTimes(1);
  });

  it("handles malformed JSON by triggering reformat prompt", async () => {
    // First attempt: invalid JSON
    vi.mocked(extractJSONSubstring).mockReturnValueOnce("invalid json string");

    // Reformat attempt: valid JSON
    mockResponse.response.text.mockReturnValueOnce("bad output");
    mockResponse.response.text.mockReturnValueOnce(`
      {"topic": "Cell Division", "summary": "Mitosis and meiosis", "children": []}
    `);
    vi.mocked(extractJSONSubstring).mockReturnValueOnce(`
      {"topic": "Cell Division", "summary": "Mitosis and meiosis", "children": []}
    `);

    const result = await generateKnowledgeTree("biology content");

    expect(result).toEqual({
      topic: "Cell Division",
      summary: "Mitosis and meiosis",
      children: [],
    });

    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    expect(mockGenerateContent).toHaveBeenCalledWith(expect.stringContaining("The previous output could not be parsed as JSON"));
  });

  it("applies ensureNodeDefaults to repair the parsed node", async () => {
    const incompleteNode = {
      topic: "Quantum Physics",
      // missing summary and children
    };

    vi.mocked(extractJSONSubstring).mockReturnValue(JSON.stringify(incompleteNode));

    const repairedNode = {
      topic: "Quantum Physics",
      summary: "",
      children: [],
    };
    vi.mocked(ensureNodeDefaults).mockReturnValue(repairedNode);

    const result = await generateKnowledgeTree("quantum content");

    expect(result).toEqual(repairedNode);
    expect(ensureNodeDefaults).toHaveBeenCalledWith(incompleteNode);
  });

  it("throws RATE_LIMIT_EXCEEDED on 503 error", async () => {
    const error503 = new Error("Service unavailable");
    (error503 as any).status = 503;

    mockGenerateContent.mockRejectedValue(error503);

    await expect(generateKnowledgeTree("content")).rejects.toThrow("RATE_LIMIT_EXCEEDED");
  });

  it("throws generic error on other failures", async () => {
    mockGenerateContent.mockRejectedValue(new Error("Network timeout"));

    await expect(generateKnowledgeTree("content")).rejects.toThrow("Failed to generate knowledge tree");
  });

  it("uses provided API key and model name", async () => {
    vi.mocked(extractJSONSubstring).mockReturnValue(`{"topic":"Test","summary":"Test","children":[]}`);
    vi.mocked(ensureNodeDefaults).mockImplementation((n) => n);

    await generateKnowledgeTree("content", "custom-key-123", "gemini-1.5-pro");

    expect(getGeminiModel).toHaveBeenCalledWith("custom-key-123", "gemini-1.5-pro");
  });
});