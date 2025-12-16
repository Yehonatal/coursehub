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
        <div className="p-6 bg-white border-t shrink-0">
            <div className="flex flex-wrap gap-2 text-xs mb-2 text-muted-foreground">
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
                        className="px-3 py-1.5 rounded-full border border-border/60 bg-secondary/50 hover:border-primary/40 hover:text-foreground transition-colors"
                    >
                        {chip}
                    </button>
                ))}
            </div>
            <div className="relative bg-gray-100 rounded-3xl p-4 transition-all focus-within:ring-2 focus-within:ring-[#0A251D]/10 focus-within:bg-white border border-transparent focus-within:border-gray-200">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Need flashcards, summaries, or quiz questions? Just ask."
                    className="w-full bg-transparent border-none p-0 text-gray-700 placeholder:text-gray-500 focus:ring-0 resize-none min-h-[60px] text-base"
                    rows={2}
                    disabled={isLoading || isParsing}
                />
                <div className="flex justify-end mt-2">
                    <button
                        onClick={onSend}
                        className={cn(
                            "p-2 rounded-full transition-all duration-200 border border-transparent",
                            value.trim() && !isLoading && !isParsing
                                ? "bg-[#0A251D] text-white hover:bg-[#0A251D]/90 shadow-md"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
