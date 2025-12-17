"use client";

import React, { useState } from "react";
import { FileText, HelpCircle, Network } from "lucide-react";
import { Card } from "@/components/ui/card";
import { GeneratedContentModal } from "./GeneratedContentModal";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ResourceSidebar({
    generations,
    resourceId,
}: {
    generations?: any[];
    resourceId?: string;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const displayGenerations = generations?.slice(0, 3) || [];

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
                        displayGenerations.map((gen, i) => (
                            <Card
                                key={i}
                                className="p-4 hover:border-blue-200 transition-colors cursor-pointer group"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <div className="flex gap-4">
                                    <div
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                            gen.generationType === "notes"
                                                ? "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                                                : gen.generationType === "tree"
                                                ? "bg-green-50 text-green-600 group-hover:bg-green-100"
                                                : "bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100"
                                        }`}
                                    >
                                        {gen.generationType === "notes" ? (
                                            <FileText className="w-5 h-5" />
                                        ) : gen.generationType === "tree" ? (
                                            <Network className="w-5 h-5" />
                                        ) : (
                                            <HelpCircle className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0A251D] text-sm line-clamp-1">
                                            {gen.title ||
                                                gen.prompt ||
                                                "Generated Content"}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {gen.generationType === "notes"
                                                ? "Study Notes"
                                                : gen.generationType === "tree"
                                                ? "Knowledge Tree"
                                                : "Flashcards"}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                            <span>
                                                {new Date(
                                                    gen.createdAt
                                                ).toLocaleDateString()}
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
        </div>
    );
}
