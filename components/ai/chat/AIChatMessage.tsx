import React from "react";
import { Layers, FileText, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import ReactMarkdown from "react-markdown";
import { AIFlashcard, AIStudyNote, AIKnowledgeNode } from "@/types/ai";

interface Message {
    role: "user" | "model";
    parts: string;
    type?: "text" | "notes" | "flashcards" | "tree";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
}

interface AIChatMessageProps {
    message: Message;
    onViewFlashcards: (cards: AIFlashcard[]) => void;
    onViewNotes: (notes: AIStudyNote) => void;
    onViewTree: (tree: AIKnowledgeNode) => void;
}

export function AIChatMessage({
    message,
    onViewFlashcards,
    onViewNotes,
    onViewTree,
}: AIChatMessageProps) {
    return (
        <div
            className={cn(
                "flex w-full",
                message.role === "user" ? "justify-end" : "justify-start"
            )}
        >
            <div
                className={cn(
                    "rounded-2xl px-4 py-2 max-w-[80%] text-sm",
                    message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-card border border-border rounded-tl-none shadow-sm"
                )}
            >
                <div className="prose dark:prose-invert max-w-none text-sm">
                    <ReactMarkdown>{message.parts}</ReactMarkdown>
                </div>

                {message.type === "flashcards" && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full gap-2"
                        onClick={() => onViewFlashcards(message.data)}
                    >
                        <Layers className="h-4 w-4" /> View Flashcards
                    </Button>
                )}

                {message.type === "notes" && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full gap-2"
                        onClick={() => onViewNotes(message.data)}
                    >
                        <FileText className="h-4 w-4" /> View Notes
                    </Button>
                )}

                {message.type === "tree" && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full gap-2"
                        onClick={() => onViewTree(message.data)}
                    >
                        <Network className="h-4 w-4" /> View Knowledge Tree
                    </Button>
                )}
            </div>
        </div>
    );
}
