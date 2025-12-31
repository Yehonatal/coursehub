export type IconType = "tree" | "note" | "question";

export function toIconType(type?: string): IconType {
    if (!type) return "note";
    const t = type.toLowerCase();
    if (t === "tree") return "tree";
    if (
        t === "flashcards" ||
        t === "cards" ||
        t === "question" ||
        t === "flashcard"
    )
        return "question";
    return "note";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapGenerationToRecentItem(gen: any, author = "You") {
    const generationType = (gen.generationType || "notes").toLowerCase();

    const title =
        gen.title ||
        (typeof gen.prompt === "string"
            ? gen.prompt.substring(0, 30) +
              (gen.prompt.length > 30 ? "..." : "")
            : generationType.charAt(0).toUpperCase() + generationType.slice(1));

    // Helper to count nodes in a knowledge tree
    const countTreeNodes = (nodeOrNodes: any): number => {
        if (!nodeOrNodes) return 0;
        if (Array.isArray(nodeOrNodes)) {
            return nodeOrNodes.reduce((acc, n) => acc + countTreeNodes(n), 0);
        }
        // Single node object
        const children = Array.isArray(nodeOrNodes.children)
            ? nodeOrNodes.children
            : [];
        let count = 1; // count this node
        for (const c of children) count += countTreeNodes(c);
        return count;
    };

    let meta: string;
    if (generationType === "notes") {
        meta = "Study Notes";
    } else if (generationType === "tree") {
        const nodes = countTreeNodes(gen.content);
        meta = `${nodes} Node${nodes === 1 ? "" : "s"}`;
    } else {
        let cards = 0;
        if (Array.isArray(gen.content)) cards = gen.content.length;
        else if (Array.isArray(gen.content?.cards))
            cards = gen.content.cards.length;
        meta = `${cards} Card${cards === 1 ? "" : "s"}`;
    }

    return {
        title,
        type:
            generationType === "notes"
                ? "Note"
                : generationType === "tree"
                ? "Knowledge Tree"
                : "Flashcards",
        meta,
        author,
        iconType: toIconType(generationType),
        data: gen.content,
    };
}
