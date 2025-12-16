import { createRequire } from "module";
import path from "path";
import JSZip from "jszip";
import { parseStringPromise } from "xml2js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { parsePDF } from "./pdf";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export async function parseFile(
    buffer: Buffer,
    mimeType: string,
    fileName: string
): Promise<string> {
    // Normalize extension
    const ext = path.extname(fileName).toLowerCase();

    try {
        if (buffer.length > MAX_FILE_SIZE) {
            throw new Error("File too large");
        }

        if (mimeType === "application/pdf" || ext === ".pdf") {
            return await parsePDF(buffer);
        } else if (
            mimeType ===
                "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
            mimeType === "application/vnd.ms-powerpoint" ||
            ext === ".pptx"
        ) {
            return await parsePPTX(buffer);
        } else if (
            mimeType.startsWith("text/") ||
            ext === ".txt" ||
            ext === ".md" ||
            ext === ".csv" ||
            ext === ".json" ||
            ext === ".pptx"
        ) {
            return buffer.toString("utf-8");
        } else {
            throw new Error(`Unsupported file type: ${ext || mimeType}`);
        }
    } catch (error) {
        console.error("Error in parseFile:", error);
        // Return a clean error message that the UI can handle
        return `Error: ${(error as Error).message}`;
    }
}

async function parsePPTX(buffer: Buffer): Promise<string> {
    try {
        const zip = await JSZip.loadAsync(buffer);
        const slideFiles = Object.keys(zip.files).filter((f) =>
            f.startsWith("ppt/slides/slide")
        );

        // Sort slides to ensure order (slide1.xml, slide2.xml, etc.)
        slideFiles.sort((a, b) => {
            const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] || "0");
            const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] || "0");
            return numA - numB;
        });

        let text = "";

        for (const slide of slideFiles) {
            const xml = await zip.files[slide].async("string");
            const parsed = await parseStringPromise(xml);

            // Navigate the XML structure to find text
            // Structure: p:sld -> p:cSld -> p:spTree -> p:sp -> p:txBody -> a:p -> a:r -> a:t
            const spTree = parsed["p:sld"]?.["p:cSld"]?.[0]?.["p:spTree"]?.[0];
            const shapes = spTree?.["p:sp"] || [];

            let slideText = "";

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            for (const shape of shapes) {
                const txBody = shape["p:txBody"]?.[0];
                if (!txBody) continue;

                const paragraphs = txBody["a:p"] || [];

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                for (const p of paragraphs) {
                    const runs = p["a:r"] || [];
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    for (const r of runs) {
                        const t = r["a:t"]?.[0];
                        if (typeof t === "string") {
                            slideText += t + " ";
                        } else if (t && typeof t === "object" && t._) {
                            // Handle cases where text might be an object with content in _
                            slideText += t._ + " ";
                        }
                    }
                    slideText += "\n";
                }
            }

            if (slideText.trim()) {
                text += `--- Slide ${
                    slideFiles.indexOf(slide) + 1
                } ---\n${slideText}\n`;
            }
        }

        if (!text.trim()) {
            throw new Error("Empty PPTX content or no text found");
        }

        return text;
    } catch (error) {
        console.error("Error parsing PPTX:", error);
        throw new Error("Could not parse the presentation file.");
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
    } catch (e) {
        console.error("Error chunking text:", e);
        // Fallback to simple chunking
        const chunks = [];
        for (let i = 0; i < text.length; i += chunkSize) {
            chunks.push(text.slice(i, i + chunkSize));
        }
        return chunks.length > 0 ? chunks : [text];
    }
}
