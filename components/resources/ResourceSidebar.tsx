"use client";

import React, { useState } from "react";
import { FileText, HelpCircle, Network } from "lucide-react";
import { Card } from "@/components/ui/card";
import { GeneratedContentModal } from "./GeneratedContentModal";
import { FlashcardModal } from "@/components/ai/FlashcardModal";
import { AIStudyNoteModal } from "@/components/ai/chat/AIStudyNoteModal";
import { AIKnowledgeTreeModal } from "@/components/ai/chat/AIKnowledgeTreeModal";
import { mapGenerationToRecentItem } from "@/lib/ai/mappers";

interface RecentItem {
    title: string;
    type: string;
    meta: string;
    author: string;
    iconType: "note" | "tree" | "question";
    id?: string;
    createdAt?: string | Date;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
}

export function ResourceSidebar({
    generations,
    resourceId,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generations?: any[];
    resourceId?: string;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const displayGenerations = (generations?.slice(0, 3) || []).map((gen) => ({
        id: gen.id || gen._id || (gen._id ? String(gen._id) : undefined),
        ...mapGenerationToRecentItem(gen),
        createdAt: gen.createdAt,
    }));
    const [selectedItem, setSelectedItem] = useState<RecentItem | null>(null);

    const handleItemClick = (item: RecentItem) => {
        if (item.data) {
            setSelectedItem(item);
        }
    };

    return (
        <div className="space-y-8">
            <div className="sticky top-24">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif font-bold text-primary text-lg">
                        AI Insights
                    </h3>
                    {resourceId && generations && generations.length > 0 && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-xs text-primary font-bold hover:opacity-70 transition-opacity uppercase tracking-wider"
                        >
                            View All
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {displayGenerations.length > 0 ? (
                        displayGenerations.map((item, i) => (
                            <Card
                                key={item.id ?? i}
                                className="p-5 hover:border-primary/30 transition-all duration-300 cursor-pointer group rounded-[1.5rem] border-border/40 bg-white hover:shadow-lg hover:shadow-primary/5"
                                onClick={() => handleItemClick(item)}
                            >
                                <div className="flex gap-4">
                                    <div
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                            item.iconType === "note"
                                                ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                                                : item.iconType === "tree"
                                                ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
                                                : "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white"
                                        }`}
                                    >
                                        {item.iconType === "note" ? (
                                            <FileText className="w-6 h-6" />
                                        ) : item.iconType === "tree" ? (
                                            <Network className="w-6 h-6" />
                                        ) : (
                                            <HelpCircle className="w-6 h-6" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4
                                            suppressHydrationWarning
                                            className="font-bold text-primary text-sm line-clamp-1 group-hover:text-primary/80 transition-colors"
                                        >
                                            {item.title}
                                        </h4>
                                        <p
                                            suppressHydrationWarning
                                            className="text-[10px] text-muted-foreground/60 mt-1 font-bold uppercase tracking-wider"
                                        >
                                            {item.type}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground/40 font-medium">
                                            <span suppressHydrationWarning>
                                                {item.createdAt
                                                    ? new Date(
                                                          item.createdAt
                                                      ).toLocaleDateString()
                                                    : ""}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="p-8 rounded-[2rem] border border-dashed border-border/60 bg-muted/5 text-center space-y-3">
                            <div className="h-12 w-12 rounded-full bg-muted/10 flex items-center justify-center mx-auto">
                                <Network className="h-6 w-6 text-muted-foreground/40" />
                            </div>
                            <p className="text-xs text-muted-foreground/60 font-medium">
                                No AI content generated yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <GeneratedContentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                generations={generations || []}
            />

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
        </div>
    );
}
