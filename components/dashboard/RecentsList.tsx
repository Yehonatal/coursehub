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
            return <FileText className="h-5 w-5 text-blue-500" />;
        case "tree":
            return <Network className="h-5 w-5 text-teal-500" />;
        case "question":
            return <HelpCircle className="h-5 w-5 text-yellow-500" />;
        default:
            return <FileText className="h-5 w-5 text-gray-500" />;
    }
};

const getBg = (type: string) => {
    switch (type) {
        case "note":
            return "bg-blue-50";
        case "tree":
            return "bg-teal-50";
        case "question":
            return "bg-yellow-50";
        default:
            return "bg-gray-50";
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
                className="mb-8"
                data-aos="fade-up"
                data-aos-delay="200"
                suppressHydrationWarning
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-4 group cursor-pointer"
                            onClick={() => handleItemClick(item)}
                        >
                            <div
                                className={`h-12 w-12 rounded-xl ${getBg(
                                    item.iconType
                                )} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
                            >
                                {getIcon(item.iconType)}
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                                <h4 className="font-bold text-[#0A251D] text-sm leading-tight mb-1.5 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                                    <span className="text-[#0A251D]">
                                        {item.type}
                                    </span>
                                    <span className="text-gray-300">•</span>
                                    <span>{item.meta}</span>
                                    <span className="text-gray-300">•</span>
                                    <span>by {item.author}</span>
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
