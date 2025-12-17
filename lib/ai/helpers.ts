import { AIKnowledgeNode } from "@/types/ai";

function extractJSONSubstring(text: string, expectArray = true) {
    // Strip surrounding markdown fences
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();

    // If it already looks like valid JSON, return it
    try {
        JSON.parse(cleaned);
        return cleaned;
    } catch (e) {
        // Fall through to heuristics
    }

    // Heuristic: find first '[' and last ']' for arrays, or first '{' and last '}' for objects
    if (expectArray) {
        const first = cleaned.indexOf("[");
        const last = cleaned.lastIndexOf("]");
        if (first !== -1 && last !== -1 && last > first) {
            return cleaned.substring(first, last + 1);
        }
    } else {
        const first = cleaned.indexOf("{");
        const last = cleaned.lastIndexOf("}");
        if (first !== -1 && last !== -1 && last > first) {
            return cleaned.substring(first, last + 1);
        }
    }

    // As a last resort return the cleaned text and let JSON.parse fail upstream
    return cleaned;
}
function ensureNodeDefaults(node: any): AIKnowledgeNode {
    const id =
        node.id ||
        (node.label ? node.label.toLowerCase().replace(/\s+/g, "_") : "root");
    const label = node.label || node.id || "Root";
    const description = node.description || undefined;
    const children = Array.isArray(node.children)
        ? node.children.map((c: any) => ensureNodeDefaults(c))
        : [];
    return { id, label, description, children };
}

export { ensureNodeDefaults, extractJSONSubstring };
