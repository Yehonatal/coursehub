import path from "path";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import officeparser from "officeparser";
import { error } from "@/lib/logger";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export async function parseFile(
    buffer: Buffer,
    mimeType: string,
    fileName: string
): Promise<string> {
    const ext = path.extname(fileName).toLowerCase();

    try {
        if (buffer.length > MAX_FILE_SIZE) {
            throw new Error("File too large");
        }

        // Handle PDFs and office docs with officeparser (extracts clean text)
        if (
            mimeType === "application/pdf" ||
            ext === ".pdf" ||
            mimeType.includes("officedocument") || // Covers .docx, .pptx, etc.
            [".docx", ".pptx", ".xlsx"].includes(ext)
        ) {
            // officeparser extracts text directly from buffer
            const text = await officeparser.parseOfficeAsync(buffer);
            if (!text.trim()) {
                throw new Error("No text extracted from file");
            }
            return text.trim();
        } else if (
            mimeType.startsWith("text/") ||
            ext === ".txt" ||
            ext === ".md" ||
            ext === ".csv" ||
            ext === ".json"
        ) {
            return buffer.toString("utf-8");
        } else {
            throw new Error(`Unsupported file type: ${ext || mimeType}`);
        }
    } catch (err) {
        error("Error in parseFile:", err);
        const msg = err instanceof Error ? err.message : String(err);
        return `Error: ${msg}`;
    }
}

export async function chunkText(
    text: string,
    chunkSize: number = 1500,
    chunkOverlap: number = 200
): Promise<string[]> {
    try {
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize,
            chunkOverlap,
            separators: ["\n\n", "\n", ". ", " ", ""],
        });

        return await splitter.splitText(text);
    } catch (err) {
        error("Error chunking text:", err);
        // Fallback to simple chunking
        const chunks = [];
        for (let i = 0; i < text.length; i += chunkSize) {
            chunks.push(text.slice(i, i + chunkSize));
        }
        return chunks.length > 0 ? chunks : [text];
    }
}

/**
 * Parses a comma-separated string of tags into a trimmed array of non-empty strings.
 * @param tags - The comma-separated tags string.
 * @returns An array of tags.
 */
export function parseTags(tags: string | null | undefined): string[] {
    if (!tags) return [];
    return tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
}
