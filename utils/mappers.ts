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

    let meta: string;
    if (generationType === "notes") {
        meta = "Study Notes";
    } else if (generationType === "tree") {
        meta = `${gen.content?.nodes?.length || 0} Nodes`;
    } else {
        meta = `${gen.content?.length || 0} Cards`;
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
