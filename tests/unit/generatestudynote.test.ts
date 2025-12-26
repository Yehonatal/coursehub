import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateStudyNotes } from "../../lib/ai/summary"; // Adjust if filename is different, e.g. studyNotes.ts
import { getGeminiModel } from "../../lib/ai/gemini";

// Mock getGeminiModel
vi.mock("../../lib/ai/gemini", () => ({
  getGeminiModel: vi.fn(),
}));

describe("generateStudyNotes", () => {
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
      \`\`\`json
      {
        "title": "Photosynthesis",
        "keyPoints": ["Plants use sunlight", "Produce glucose and oxygen"],
        "explanation": "Detailed explanation here",
        "examples": ["Trees", "Grass"]
      }
      \`\`\`
    `);

    vi.mocked(getGeminiModel).mockReturnValue(mockModel as any);
  });

  it("successfully generates study notes with clean JSON", async () => {
    const content = "Photosynthesis is the process by which plants convert sunlight into energy.";

    const result = await generateStudyNotes(content);

    expect(result).toEqual({
      title: "Photosynthesis",
      keyPoints: ["Plants use sunlight", "Produce glucose and oxygen"],
      explanation: "Detailed explanation here",
      examples: ["Trees", "Grass"],
    });

    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockGenerateContent).toHaveBeenCalledWith(expect.stringContaining(content));
  });

  it("handles JSON wrapped in markdown fences and extracts correctly", async () => {
    mockResponse.response.text.mockReturnValue(`
      Here are your study notes:

      \`\`\`json
      {"title": "Cell Structure", "keyPoints": ["Nucleus", "Mitochondria"], "explanation": "Cells are basic units", "examples": []}
      \`\`\`
    `);

    const result = await generateStudyNotes("cell biology");

    expect(result.title).toBe("Cell Structure");
    expect(result.keyPoints).toContain("Nucleus");
  });

  it("handles malformed JSON by triggering reformat prompt", async () => {
    // First attempt: broken JSON
    mockResponse.response.text.mockReturnValueOnce(`
      This is not valid JSON: {title: "Invalid"}
    `);

    // Reformat attempt: valid JSON
    mockResponse.response.text.mockReturnValueOnce(`
      \`\`\`json
      {"title": "Reformatted", "keyPoints": ["Point 1"], "explanation": "Fixed", "examples": []}
      \`\`\`
    `);

    const result = await generateStudyNotes("broken content");

    expect(result.title).toBe("Reformatted");
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    expect(mockGenerateContent).toHaveBeenCalledWith(expect.stringContaining("The previous output could not be parsed as JSON"));
  });

  it("throws RATE_LIMIT_EXCEEDED on 503 error", async () => {
    const error503 = new Error("Service unavailable");
    (error503 as any).status = 503;

    mockGenerateContent.mockRejectedValue(error503);

    await expect(generateStudyNotes("content")).rejects.toThrow("RATE_LIMIT_EXCEEDED");
  });

  it("throws generic error on other failures", async () => {
    mockGenerateContent.mockRejectedValue(new Error("Connection failed"));

    await expect(generateStudyNotes("content")).rejects.toThrow("Failed to generate study notes");
  });

  it("uses provided API key and model name", async () => {
    mockResponse.response.text.mockReturnValue(`
      \`\`\`json
      {"title": "Test", "keyPoints": [], "explanation": "", "examples": []}
      \`\`\`
    `);

    await generateStudyNotes("content", "custom-api-key", "gemini-1.5-pro");

    expect(getGeminiModel).toHaveBeenCalledWith("custom-api-key", "gemini-1.5-pro");
  });
});