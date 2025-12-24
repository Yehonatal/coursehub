import { describe, it, expect, vi } from "vitest";
import { parseFile, chunkText } from "../../lib/ai/parser";
import { Buffer } from "node:buffer";

// Optional type fix
declare module "pdf-parse";

// Mock officeparser
vi.mock("officeparser", () => {
  const parseOfficeAsyncMock = vi.fn()
    // 1. PDF success test → return valid content
    .mockResolvedValueOnce("Mock PDF Content")
    // 2. Failure test → REJECT to trigger catch block → friendly message
    .mockRejectedValueOnce(new Error("No text extracted from file"))
    // 3. PPTX success test → return content with "Slide Text"
    .mockResolvedValueOnce("Mock PPTX Content with Slide Text");

  return {
    __esModule: true,
    default: {
      parseOfficeAsync: parseOfficeAsyncMock,
    },
    parseOfficeAsync: parseOfficeAsyncMock,
  };
});

describe("parseFile", () => {
  it("should parse text files correctly", async () => {
    const buffer = Buffer.from("Hello World");
    const result = await parseFile(buffer, "text/plain", "test.txt");
    expect(result).toBe("Hello World");
  });

  it("should parse markdown files correctly", async () => {
    const buffer = Buffer.from("# Hello Markdown");
    const result = await parseFile(buffer, "text/markdown", "test.md");
    expect(result).toBe("# Hello Markdown");
  });

  it("should parse PDF files correctly", async () => {
    const buffer = Buffer.from("dummy pdf content");
    const result = await parseFile(buffer, "application/pdf", "test.pdf");
    expect(result).toBe("Mock PDF Content");
  });




  it("should handle unsupported file types", async () => {
    const buffer = Buffer.from("unknown");
    const result = await parseFile(buffer, "application/unknown", "test.xyz");
    expect(result).toContain("Error: Unsupported file type");
  });

  it("should handle large files", async () => {
    const largeBuffer = Buffer.alloc(21 * 1024 * 1024); // 21MB
    const result = await parseFile(largeBuffer, "text/plain", "large.txt");
    expect(result).toContain("Error: File too large");
  });
});

describe("chunkText", () => {
  it("should chunk text correctly", async () => {
    const text = "Hello world. This is a test sentence for chunking.";
    const chunks = await chunkText(text, 15, 0);
    expect(Array.isArray(chunks)).toBe(true);
    expect(chunks.length).toBeGreaterThan(0);
  });
});