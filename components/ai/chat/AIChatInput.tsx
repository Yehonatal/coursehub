"use-client";
import React, { useRef } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/utils/cn";

interface AIChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    isLoading: boolean;
    isParsing: boolean;
}

export function AIChatInput({
    value,
    onChange,
    onSend,
    isLoading,
    isParsing,
}: AIChatInputProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleChipClick = (chip: string) => {
        const newVal = value.trim()
            ? `${value}${value.endsWith(" ") ? "" : " "}${chip}`
            : chip;
        onChange(newVal);
        // focus and move caret to end
        setTimeout(() => {
            textareaRef.current?.focus();
            textareaRef.current?.setSelectionRange(
                newVal.length,
                newVal.length
            );
        }, 0);
    };

    return (
        <div className="p-6 bg-card border-t border-border shrink-0">
            <div className="flex flex-wrap gap-2 text-xs mb-3 text-muted-foreground">
                {[
                    "Summarize a PDF",
                    "Create a flashcard set",
                    "Explain this concept",
                    "Generate a knowledge tree",
                ].map((chip) => (
                    <button
                        type="button"
                        key={chip}
                        onClick={() => handleChipClick(chip)}
                        className="px-3 py-1.5 rounded-full border border-border bg-muted/50 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all"
                    >
                        {chip}
                    </button>
                ))}
            </div>
            <div className="relative bg-muted/30 rounded-3xl p-4 transition-all focus-within:ring-2 focus-within:ring-primary/10 focus-within:bg-background border border-border/50 focus-within:border-primary/30">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Need flashcards, summaries, or quiz questions? Just ask."
                    className="w-full bg-transparent border-none p-0 text-foreground placeholder:text-muted-foreground focus:ring-0 resize-none min-h-[60px] text-base"
                    rows={2}
                    disabled={isLoading || isParsing}
                />
                <div className="flex justify-end mt-2">
                    <button
                        onClick={onSend}
                        className={cn(
                            "p-2.5 rounded-full transition-all duration-200 border border-transparent",
                            value.trim() && !isLoading && !isParsing
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:scale-105 active:scale-95"
                                : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                        disabled={!value.trim() || isLoading || isParsing}
                    >
                        <ArrowUp className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
