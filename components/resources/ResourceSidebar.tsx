"use client";

import React, { useState } from "react";
import { FileText, HelpCircle, Network, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { GeneratedContentModal } from "./GeneratedContentModal";
import { FlashcardModal } from "@/components/ai/FlashcardModal";
import { AIStudyNoteModal } from "@/components/ai/chat/AIStudyNoteModal";
import { AIKnowledgeTreeModal } from "@/components/ai/chat/AIKnowledgeTreeModal";
import { mapGenerationToRecentItem } from "@/utils/mappers";
import { PremiumLock } from "@/components/common/PremiumLock";

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

const DUMMY_GENERATIONS: Partial<RecentItem>[] = [
    {
        title: "Comprehensive Study Guide",
        type: "Study Notes",
        iconType: "note",
        createdAt: new Date(),
    },
    {
        title: "Key Concepts & Definitions",
        type: "Flashcards",
        iconType: "question",
        createdAt: new Date(),
    },
    {
        title: "Topic Relationship Map",
        type: "Knowledge Tree",
        iconType: "tree",
        createdAt: new Date(),
    },
];

export function ResourceSidebar({
    generations,
    resourceId,
    isPremium = false,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generations?: any[];
    resourceId?: string;
    isPremium?: boolean;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userGenerations = (generations || []).map((gen) => ({
        id: gen.id || gen._id || (gen._id ? String(gen._id) : undefined),
        ...mapGenerationToRecentItem(gen),
        createdAt: gen.createdAt,
        data: gen.data || gen.content,
    }));

    const displayGenerations = isPremium
        ? userGenerations.slice(0, 3)
        : userGenerations.length > 0
        ? userGenerations.slice(0, 3)
        : DUMMY_GENERATIONS;

    const [selectedItem, setSelectedItem] = useState<RecentItem | null>(null);

    const handleItemClick = (item: RecentItem) => {
        if (!isPremium) return;
        if (item.data) {
            setSelectedItem(item);
        }
    };

    return (
        <div className="space-y-8">
            <div className="sticky top-24">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif font-bold text-foreground text-lg flex items-center gap-2">
                        AI Insights
                        {!isPremium && (
                            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        )}
                    </h3>
                    {isPremium &&
                        resourceId &&
                        generations &&
                        generations.length > 0 && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-xs text-primary font-bold hover:opacity-70 transition-opacity uppercase tracking-wider"
                            >
                                View All
                            </button>
                        )}
                </div>

                <PremiumLock
                    isPremium={isPremium}
                    title="AI Insights"
                    description="Upgrade to Pro to view community-generated AI insights and save your own."
                >
                    <div className="space-y-4">
                        {displayGenerations.length > 0 ? (
                            displayGenerations.map((item, i) => (
                                <Card
                                    key={item.id ?? i}
                                    className="p-5 hover:border-primary/30 transition-all duration-300 cursor-pointer group rounded-3xl border border-border bg-card hover:shadow-lg hover:shadow-primary/5"
                                    onClick={() =>
                                        handleItemClick(item as RecentItem)
                                    }
                                >
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
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
                                                className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors"
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
                            <div className="p-8 rounded-3xl border border-dashed border-border bg-card text-center space-y-3">
                                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto">
                                    <Network className="h-6 w-6 text-primary/40" />
                                </div>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                    No AI content generated yet.
                                </p>
                            </div>
                        )}
                    </div>
                </PremiumLock>
            </div>

            <GeneratedContentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                generations={generations || []}
            />

            {selectedItem?.iconType === "question" && (
                <FlashcardModal
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    flashcards={selectedItem.data}
                />
            )}

            {selectedItem?.iconType === "note" && (
                <AIStudyNoteModal
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    note={selectedItem.data}
                />
            )}

            {selectedItem?.iconType === "tree" && (
                <AIKnowledgeTreeModal
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    tree={selectedItem.data}
                />
            )}
        </div>
    );
}
