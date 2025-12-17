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
        <div className="space-y-6">
            <div className="sticky top-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#0A251D]">
                        Generated Content
                    </h3>
                    {resourceId && generations && generations.length > 0 && (
                        <span
                            onClick={() => setIsModalOpen(true)}
                            className="text-xs text-blue-600 font-medium cursor-pointer hover:underline"
                        >
                            View All
                        </span>
                    )}
                </div>

                <div className="space-y-3">
                    {displayGenerations.length > 0 ? (
                        displayGenerations.map((item, i) => (
                            <Card
                                key={item.id ?? i}
                                className="p-4 hover:border-blue-200 transition-colors cursor-pointer group"
                                onClick={() => handleItemClick(item)}
                            >
                                <div className="flex gap-4">
                                    <div
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                            item.iconType === "note"
                                                ? "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                                                : item.iconType === "tree"
                                                ? "bg-green-50 text-green-600 group-hover:bg-green-100"
                                                : "bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100"
                                        }`}
                                    >
                                        {item.iconType === "note" ? (
                                            <FileText className="w-5 h-5" />
                                        ) : item.iconType === "tree" ? (
                                            <Network className="w-5 h-5" />
                                        ) : (
                                            <HelpCircle className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <h4
                                            suppressHydrationWarning
                                            className="font-bold text-[#0A251D] text-sm line-clamp-1"
                                        >
                                            {item.title}
                                        </h4>
                                        <p
                                            suppressHydrationWarning
                                            className="text-xs text-gray-500 mt-0.5"
                                        >
                                            {item.type}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
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
                        <div className="text-sm text-gray-500 italic">
                            No content generated yet. Be the first to generate
                            study materials!
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
