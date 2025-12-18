"use client";

import React, { useState } from "react";
import { FileText, Network, HelpCircle } from "lucide-react";
import Link from "next/link";
import { FlashcardModal } from "@/components/ai/FlashcardModal";
import { AIStudyNoteModal } from "@/components/ai/chat/AIStudyNoteModal";
import { AIKnowledgeTreeModal } from "@/components/ai/chat/AIKnowledgeTreeModal";

interface PopularResource {
    id: string;
    title: string;
    type: string;
    meta: string;
    author: string;
    iconType: "note" | "tree" | "question";
    data?: any;
    href?: string;
}

interface PopularResourcesListProps {
    resources?: any[];
}

const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("tree")) return <Network className="h-5 w-5 text-primary" />;
    if (t.includes("question") || t.includes("flashcard"))
        return <HelpCircle className="h-5 w-5 text-primary" />;
    return <FileText className="h-5 w-5 text-primary" />;
};

const getBg = (type: string) => {
    return "bg-primary/5 border-primary/10";
};

export function PopularResourcesList({
    resources = [],
}: PopularResourcesListProps) {
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const items = resources.slice(0, 4).map((r) => {
        // Handle AI Generation objects from MongoDB
        if (r.generationType) {
            const type =
                r.generationType === "notes"
                    ? "Note"
                    : r.generationType === "tree"
                    ? "Knowledge Tree"
                    : "Flashcards";

            let meta = "";
            if (r.generationType === "notes") {
                meta = "Study Notes";
            } else if (r.generationType === "tree") {
                meta = `${r.content?.nodes?.length || 0} Nodes`;
            } else {
                meta = `${r.content?.length || 0} Cards`;
            }

            return {
                id: r._id || r.id,
                title: r.title || "AI Generated Content",
                type,
                meta: `${r.viewedCount || 0} views • ${meta}`,
                author: "AI Assistant",
                iconType: (r.generationType === "tree"
                    ? "tree"
                    : r.generationType === "flashcards"
                    ? "question"
                    : "note") as any,
                data: r,
            };
        }

        // Handle standard Resource objects from Postgres
        const rawType = r.resource_type || "note";
        return {
            id: r.resource_id || r.id,
            title: r.title,
            type: rawType.charAt(0).toUpperCase() + rawType.slice(1),
            meta: `${r.views || 0} views`,
            author: r.author?.name || "Anonymous",
            iconType: (rawType.toLowerCase().includes("tree")
                ? "tree"
                : rawType.toLowerCase().includes("question")
                ? "question"
                : "note") as any,
            href: `/resources/${r.resource_id || r.id}`,
        };
    });

    if (items.length === 0) return null;

    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                    Trending
                </p>
                <h3 className="text-xl font-serif font-semibold text-foreground tracking-tight">
                    Most Popular AI Content
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {items.map((item) => {
                    const content = (
                        <div className="flex items-center gap-5 group cursor-pointer">
                            <div
                                className={`h-14 w-14 rounded-2xl border ${getBg(
                                    item.iconType
                                )} flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-300 shadow-sm group-hover:shadow-md`}
                            >
                                {getIcon(item.iconType)}
                            </div>
                            <div className="space-y-1.5">
                                <h4 className="font-serif font-semibold text-foreground text-sm leading-tight mb-1 group-hover:text-primary transition-colors tracking-tight">
                                    {item.title}
                                </h4>
                                <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60 font-medium uppercase tracking-wider">
                                    <span className="text-primary/60">
                                        {item.type}
                                    </span>
                                    <span className="h-1 w-1 rounded-full bg-border" />
                                    <span>{item.meta}</span>
                                    <span className="h-1 w-1 rounded-full bg-border" />
                                    <span className="lowercase">
                                        by {item.author}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );

                    if (item.href) {
                        return (
                            <Link href={item.href} key={item.id}>
                                {content}
                            </Link>
                        );
                    }

                    return (
                        <div
                            key={item.id}
                            onClick={() => setSelectedItem(item.data)}
                        >
                            {content}
                        </div>
                    );
                })}
            </div>

            {/* Modals for AI Content */}
            {selectedItem?.generationType === "flashcards" && (
                <FlashcardModal
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    flashcards={selectedItem.content}
                    title={selectedItem.title}
                />
            )}
            {selectedItem?.generationType === "notes" && (
                <AIStudyNoteModal
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    note={selectedItem.content}
                    title={selectedItem.title}
                />
            )}
            {selectedItem?.generationType === "tree" && (
                <AIKnowledgeTreeModal
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    tree={selectedItem.content}
                    title={selectedItem.title}
                />
            )}
        </div>
    );
}
