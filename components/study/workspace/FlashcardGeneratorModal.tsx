"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface FlashcardGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (count: number, depth: "simple" | "detailed") => Promise<void>;
}

export function FlashcardGeneratorModal({
    isOpen,
    onClose,
    onGenerate,
}: FlashcardGeneratorModalProps) {
    const [count, setCount] = useState<number>(10);
    const [depth, setDepth] = useState<"simple" | "detailed">("detailed");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            await onGenerate(count, depth);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate flashcards");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>How many flashcards?</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Choose the number of flashcards for your set
                    </p>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        {[10, 15, 20, 30].map((num) => (
                            <button
                                key={num}
                                onClick={() => setCount(num)}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                                    count === num
                                        ? "border-primary bg-primary/5 text-primary"
                                        : "border-border hover:border-primary/50 text-muted-foreground"
                                }`}
                            >
                                <span
                                    className={`text-lg font-bold ${count === num ? "text-primary" : "text-foreground"}`}
                                >
                                    {num === 30 ? "30+" : num}
                                </span>
                                <span className="text-xs">
                                    {num} flashcards
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <span className="text-sm font-medium">
                            Answer Depth
                        </span>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setDepth("simple")}
                                className={`p-3 rounded-lg border transition-all text-center ${
                                    depth === "simple"
                                        ? "border-primary bg-primary/5 text-primary"
                                        : "border-border hover:border-primary/50 text-muted-foreground"
                                }`}
                            >
                                <div className="text-sm font-medium text-foreground">
                                    Simple
                                </div>
                                <div className="text-xs opacity-70">
                                    Quick, concise
                                </div>
                            </button>
                            <button
                                onClick={() => setDepth("detailed")}
                                className={`p-3 rounded-lg border transition-all text-center ${
                                    depth === "detailed"
                                        ? "border-primary bg-primary/5 text-primary"
                                        : "border-border hover:border-primary/50 text-muted-foreground"
                                }`}
                            >
                                <div className="text-sm font-medium text-foreground">
                                    Detailed
                                </div>
                                <div className="text-xs opacity-70">
                                    Comprehensive
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-2 sm:justify-between">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isGenerating}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            "Generate Flashcards"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
