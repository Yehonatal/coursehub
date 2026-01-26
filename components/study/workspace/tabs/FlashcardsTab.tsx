"use client";

import { Layers, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlashcardsTabProps {
    sets: any[];
    onOpenGenerator: () => void;
    onViewCards: (set: any) => void;
}

export function FlashcardsTab({
    sets,
    onOpenGenerator,
    onViewCards,
}: FlashcardsTabProps) {
    return (
        <div className="h-full overflow-y-auto p-8 bg-muted/30">
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-foreground text-base mb-1">
                            Create Flashcard Set
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Create a flashcard set with preferred number of
                            cards.
                        </p>
                    </div>
                    <Button
                        onClick={onOpenGenerator}
                        className="px-6 py-2 h-auto text-sm font-medium rounded-lg"
                    >
                        Generate
                    </Button>
                </div>
            </div>

            {sets.length > 0 && (
                <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">
                        YOUR FLASHCARD SETS
                    </h4>
                    <div className="space-y-3">
                        {sets.map((set) => (
                            <div
                                key={set.id}
                                onClick={() => onViewCards(set)}
                                className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-blue-500/30 hover:shadow-sm transition-all group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                    <Layers size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm text-foreground">
                                        {set.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {set.count} cards •{" "}
                                        {set.depth || "General"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Just a placeholder, actually using Lucide Layers above per design
function FlashcardIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="2"
                y="6"
                width="20"
                height="15"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M5 6V4C5 2.89543 5.89543 2 7 2H17C18.1046 2 19 2.89543 19 4V6"
                stroke="currentColor"
                strokeWidth="2"
            />
        </svg>
    );
}
