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
import { Badge } from "@/components/ui/badge";

interface QuizGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (config: any) => Promise<void>;
}

export function QuizGeneratorModal({
    isOpen,
    onClose,
    onGenerate,
}: QuizGeneratorModalProps) {
    const [count, setCount] = useState<number | "unlimited">(10);
    const [types, setTypes] = useState<string[]>(["Multiple Choice"]);
    const [difficulty, setDifficulty] = useState<
        "Easy" | "Moderate" | "Difficult"
    >("Moderate");
    const [isGenerating, setIsGenerating] = useState(false);

    const availableTypes = [
        "Multiple Choice",
        "True/False",
        "Short Answer",
        "Application",
    ];

    const toggleType = (type: string) => {
        if (types.includes(type)) {
            if (types.length > 1) {
                // Require at least one
                setTypes(types.filter((t) => t !== type));
            }
        } else {
            setTypes([...types, type]);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            await onGenerate({ count, types, difficulty });
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate quiz");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>How many questions?</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Choose the number of questions for your quiz
                    </p>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        {[10, 15, 20, "unlimited"].map((num) => (
                            <button
                                key={num}
                                onClick={() => setCount(num as any)}
                                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                                    count === num
                                        ? "border-primary bg-primary/5 text-primary"
                                        : "border-border hover:border-primary/50 text-muted-foreground"
                                }`}
                            >
                                <span
                                    className={`text-lg font-bold ${count === num ? "text-primary" : "text-foreground"}`}
                                >
                                    {num === "unlimited" ? "∞" : num}
                                </span>
                                <span className="text-xs">
                                    {num === "unlimited"
                                        ? "Unlimited"
                                        : `${num} questions`}
                                </span>
                                {num === "unlimited" && (
                                    <span className="text-[10px] text-muted-foreground/70">
                                        Questions generated as you go
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <span className="text-sm font-medium">
                            Choose Question Types
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {availableTypes.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => toggleType(type)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                        types.includes(type)
                                            ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300"
                                            : "border-border text-muted-foreground hover:bg-muted/50"
                                    }`}
                                >
                                    {types.includes(type) && "✓ "}
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <span className="text-sm font-medium">
                            Difficulty Level
                        </span>
                        <div className="grid grid-cols-3 gap-3">
                            {(["Easy", "Moderate", "Difficult"] as const).map(
                                (diff) => (
                                    <button
                                        key={diff}
                                        onClick={() => setDifficulty(diff)}
                                        className={`p-2 rounded-lg border transition-all text-center ${
                                            difficulty === diff
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-border hover:border-primary/50 text-muted-foreground"
                                        }`}
                                    >
                                        <div className="text-sm font-medium text-foreground">
                                            {diff}
                                        </div>
                                        <div className="text-[10px] opacity-70">
                                            {diff === "Easy"
                                                ? "Basic recall"
                                                : diff === "Moderate"
                                                  ? "Balanced"
                                                  : "Exam-level"}
                                        </div>
                                    </button>
                                ),
                            )}
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
                            "Generate Quiz"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
