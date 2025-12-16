import React from "react";
import { ArrowRight, Bot, Command, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PromptBar() {
    return (
        <div className="rounded-3xl border border-border/80 bg-card/90 shadow-xl backdrop-blur-sm p-4 sm:p-5 space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/60 border border-border/60">
                    <Sparkles className="h-4 w-4 text-primary" /> Smart prompt
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/60 border border-border/60">
                    <Command className="h-4 w-4" /> Cmd + Enter to send
                </span>
            </div>
            <div className="relative flex items-center">
                <div className="absolute left-4 text-muted-foreground">
                    <Bot className="h-5 w-5" />
                </div>
                <Input
                    className="h-14 sm:h-16 pl-12 pr-12 rounded-2xl border-border bg-secondary/40 text-base shadow-sm focus-visible:ring-primary/25 transition-all hover:bg-secondary/60 focus:bg-background"
                    placeholder="Ask CourseHub AI anything..."
                />
                <div className="absolute right-3">
                    <Button
                        size="icon"
                        className="h-11 w-11 rounded-xl bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-all hover:scale-105"
                    >
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {[
                    "Summarize a PDF",
                    "Create a flashcard set",
                    "Explain this concept",
                    "Generate a knowledge tree",
                ].map((chip) => (
                    <button
                        key={chip}
                        className="px-3 py-1.5 rounded-full border border-border/60 bg-secondary/50 hover:border-primary/40 hover:text-foreground transition-colors"
                    >
                        {chip}
                    </button>
                ))}
            </div>
        </div>
    );
}
