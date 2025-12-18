"use client";

import React, { useState } from "react";
import { FileText, Network, HelpCircle } from "lucide-react";
import { FlashcardModal } from "@/components/ai/FlashcardModal";
import { AIStudyNoteModal } from "@/components/ai/chat/AIStudyNoteModal";
import { AIKnowledgeTreeModal } from "@/components/ai/chat/AIKnowledgeTreeModal";

interface RecentItem {
    title: string;
    type: string;
    meta: string;
    author: string;
    iconType: "note" | "tree" | "question";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
}

interface RecentsListProps {
    items: RecentItem[];
}

const getIcon = (type: string) => {
    switch (type) {
        case "note":
            return <FileText className="h-5 w-5 text-primary" />;
        case "tree":
            return <Network className="h-5 w-5 text-primary" />;
        case "question":
            return <HelpCircle className="h-5 w-5 text-primary" />;
        default:
            return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
};

const getBg = (type: string) => {
    switch (type) {
        case "note":
            return "bg-primary/10 border-primary/20";
        case "tree":
            return "bg-primary/10 border-primary/20";
        case "question":
            return "bg-primary/10 border-primary/20";
        default:
            return "bg-muted border-border";
    }
};

export function RecentsList({ items }: RecentsListProps) {
    const [selectedItem, setSelectedItem] = useState<RecentItem | null>(null);

    const handleItemClick = (item: RecentItem) => {
        if (item.data) {
            setSelectedItem(item);
        }
    };

    return (
        <>
            <section
                className="mb-12"
                data-aos="fade-up"
                data-aos-delay="200"
                suppressHydrationWarning
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-5 group cursor-pointer"
                            onClick={() => handleItemClick(item)}
                        >
                            <div
                                className={`h-14 w-14 rounded-2xl border ${getBg(
                                    item.iconType
                                )} flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 shadow-sm group-hover:shadow-md`}
                            >
                                {getIcon(item.iconType)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-serif font-semibold text-foreground text-base leading-tight mb-1.5 group-hover:text-primary transition-colors tracking-tight">
                                    {item.title}
                                </h4>
                                <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                                    <span className="text-primary">
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
                    ))}
                </div>
            </section>

            {selectedItem && selectedItem.iconType === "question" && (
                <FlashcardModal
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    flashcards={selectedItem.data}
                />
            )}

            {selectedItem && selectedItem.iconType === "note" && (
                <AIStudyNoteModal
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    note={selectedItem.data}
                />
            )}

            {selectedItem && selectedItem.iconType === "tree" && (
                <AIKnowledgeTreeModal
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    tree={selectedItem.data}
                />
            )}
        </>
    );
}
