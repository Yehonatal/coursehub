"use client";

import React from "react";
import { RecentsList } from "@/components/dashboard/RecentsList";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ResourceGenerations({ generations }: { generations: any[] }) {
    if (!generations || generations.length === 0) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = generations.map((gen: any) => ({
        title:
            gen.title ||
            gen.prompt?.substring(0, 30) +
                (gen.prompt?.length > 30 ? "..." : "") ||
            gen.generationType.charAt(0).toUpperCase() +
                gen.generationType.slice(1),
        type:
            gen.generationType === "notes"
                ? "Note"
                : gen.generationType === "tree"
                ? "Knowledge Tree"
                : "Flashcards",
        meta:
            gen.generationType === "notes"
                ? "Study Notes"
                : gen.generationType === "tree"
                ? `${gen.content.nodes?.length || 0} Nodes`
                : `${gen.content.length || 0} Cards`,
        author: "Community",
        iconType:
            gen.generationType === "notes"
                ? "note"
                : gen.generationType === "tree"
                ? "tree"
                : "question",
        data: gen.content,
    }));

    return (
        <div className="mt-8">
            <h3 className="text-xl font-serif font-bold text-[#0A251D] mb-4">
                Community Generated Content
            </h3>
            <RecentsList items={items} />
        </div>
    );
}
