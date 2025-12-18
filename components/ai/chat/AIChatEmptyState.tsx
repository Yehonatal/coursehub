import React from "react";
import {
    Lightbulb,
    HelpCircle,
    FileText,
    Network,
    Presentation,
    Loader2,
} from "lucide-react";

interface AIChatEmptyStateProps {
    resourceTitle: string;
    resourceType: string;
    onCommand: (command: string) => void | Promise<void>;
    isParsing?: boolean;
}

export function AIChatEmptyState({
    resourceTitle,
    resourceType,
    onCommand,
    isParsing,
}: AIChatEmptyStateProps) {
    return (
        <div className="w-full flex flex-col items-end space-y-4 max-w-4xl mx-auto mt-auto">
            <div className="bg-card p-3 pr-6 rounded-2xl shadow-sm border border-border flex items-center gap-3 w-fit max-w-md transition-transform hover:scale-[1.02]">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <Presentation className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground text-sm line-clamp-1">
                            {resourceTitle}
                        </h3>
                        {isParsing && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                                <span>Analyzing...</span>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                        {resourceType}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
                <button
                    onClick={() => onCommand("Make flashcards")}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary/20 transition-all shadow-sm group"
                >
                    <Lightbulb className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-primary">
                        Make flashcards
                    </span>
                </button>
                <button
                    onClick={() => onCommand("Quiz me")}
                    className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group shadow-sm"
                >
                    <HelpCircle className="w-4 h-4 text-primary/60 group-hover:text-primary group-hover:scale-110 transition-all" />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                        Quiz me
                    </span>
                </button>
                <button
                    onClick={() => onCommand("Summarize this")}
                    className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group shadow-sm"
                >
                    <FileText className="w-4 h-4 text-primary/60 group-hover:text-primary group-hover:scale-110 transition-all" />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                        Summarize this
                    </span>
                </button>
                <button
                    onClick={() => onCommand("Map this topic")}
                    className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group shadow-sm"
                >
                    <Network className="w-4 h-4 text-primary/60 group-hover:text-primary group-hover:scale-110 transition-all" />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                        Map this topic
                    </span>
                </button>
            </div>
        </div>
    );
}
