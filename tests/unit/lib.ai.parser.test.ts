import { describe, it, expect, vi, beforeEach } from "vitest";
import { parseFile, chunkText } from "../../lib/ai/parser";
import JSZip from "jszip";

// Mock pdf-parse
vi.mock("pdf-parse", () => {
    const fn = vi.fn().mockResolvedValue({ text: "Mock PDF Content" });
    // Support different module shapes (CJS, ESM default, named export)
    (fn as any).default = fn;
    (fn as any).parse = fn;
    return fn;
});

// Mock JSZip
vi.mock("jszip", () => {
    return {
        default: {
            loadAsync: vi.fn().mockResolvedValue({
                files: {
                    "ppt/slides/slide1.xml": {
                        async: vi.fn().mockResolvedValue("mock xml content"),
                    },
                },
            }),
        },
    };
});

// Mock xml2js
vi.mock("xml2js", () => ({
    parseStringPromise: vi.fn().mockResolvedValue({
        "p:sld": {
            "p:cSld": [
                {
                    "p:spTree": [
                        {
                            "p:sp": [
                                {
                                    "p:txBody": [
                                        {
                                            "a:p": [
                                                {
                                                    "a:r": [
                                                        {
                                                            "a:t": [
                                                                "Slide Text",
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    }),
}));

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

    it("should return a friendly message when parsing fails (both parsers fail)", async () => {
        // Reset module registry and mock pdf-parse to throw
        vi.resetModules();
        vi.doMock("pdf-parse", () => {
            const fn = () => {
                throw new Error("pdf-parse internal error");
            };
            (fn as any).default = fn;
            (fn as any).parse = fn;
            return fn;
        });

        // Mock pdfjs to reject with the fake-worker error
        vi.doMock("pdfjs-dist/legacy/build/pdf.mjs", () => {
            return {
                getDocument: () => ({
                    promise: Promise.reject(
                        new Error(
                            'Setting up fake worker failed: "No "GlobalWorkerOptions.workerSrc" specified."'
                        )
                    ),
                }),
            };
        });

        const { parseFile: parseFileWithMocks } = await import(
            "../../lib/ai/parser"
        );
        const buffer = Buffer.from("dummy pdf content");
        const result = await parseFileWithMocks(
            buffer,
            "application/pdf",
            "test.pdf"
        );
        expect(result).toContain("Sorry, we couldn't parse your PDF right now");

        // Restore original mocks for subsequent tests
        vi.doMock("pdf-parse", () => {
            const fn = vi.fn().mockResolvedValue({ text: "Mock PDF Content" });
            (fn as any).default = fn;
            (fn as any).parse = fn;
            return fn;
        });

        vi.doMock("pdfjs-dist/legacy/build/pdf.mjs", () => {
            return {
                getDocument: vi.fn().mockReturnValue({
                    promise: Promise.resolve({
                        numPages: 1,
                        getPage: vi.fn().mockResolvedValue({
                            getTextContent: vi.fn().mockResolvedValue({
                                items: [{ str: "Mock PDF Content" }],
                            }),
                        }),
                    }),
                }),
            };
        });
    });

    it("should parse PPTX files correctly", async () => {
        const buffer = Buffer.from("dummy pptx content");
        const result = await parseFile(
            buffer,
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "test.pptx"
        );
        expect(result).toContain("Slide Text");
    });

    it("should handle unsupported file types", async () => {
        const buffer = Buffer.from("unknown");
        const result = await parseFile(
            buffer,
            "application/unknown",
            "test.xyz"
        );
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
        const text = "Hello world. This is a test.";
        const chunks = await chunkText(text, 10, 0);
        // Note: The actual chunking depends on langchain's implementation
        // We just check if we get an array of strings
        expect(Array.isArray(chunks)).toBe(true);
        expect(chunks.length).toBeGreaterThan(0);
    });
});
