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
                        ? "bg-[#0A251D] text-white rounded-tr-none"
                        : "bg-white border border-gray-200 rounded-tl-none shadow-sm"
                )}
            >
                <div className="prose dark:prose-invert max-w-none text-sm">
                    <ReactMarkdown>{message.parts}</ReactMarkdown>
                </div>

                {message.type === "flashcards" && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full gap-2 text-black"
                        onClick={() => onViewFlashcards(message.data)}
                    >
                        <Layers className="h-4 w-4" /> View Flashcards
                    </Button>
                )}

                {message.type === "notes" && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full gap-2 text-black"
                        onClick={() => onViewNotes(message.data)}
                    >
                        <FileText className="h-4 w-4" /> View Notes
                    </Button>
                )}

                {message.type === "tree" && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full gap-2 text-black"
                        onClick={() => onViewTree(message.data)}
                    >
                        <Network className="h-4 w-4" /> View Knowledge Tree
                    </Button>
                )}
            </div>
        </div>
    );
}
