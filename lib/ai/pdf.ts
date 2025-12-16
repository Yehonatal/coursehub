import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

export async function parsePDF(buffer: Uint8Array): Promise<string> {
    // Ensure we have a Uint8Array, not a Buffer
    const data = new Uint8Array(
        buffer.buffer,
        buffer.byteOffset,
        buffer.byteLength
    );

    const pdf = await pdfjs.getDocument({
        data,
        isEvalSupported: false,
        disableFontFace: true,
    }).promise;

    let text = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();

        const pageText = content.items
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((item: any) => item.str)
            .join(" ");

        text += pageText + "\n";
    }

    return text.trim();
}
