"use client";

import ReactMarkDown from "react-markdown";
import { BrainCircuit } from "lucide-react";

interface ChatMessageProps {
    role: string;
    content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
    return (
        <div
            className={`flex gap-3 ${role === "user" ? "flex-row-reverse" : "flex-row"}`}
        >
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    role === "user"
                        ? "bg-muted"
                        : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                }`}
            >
                {role === "user" ? (
                    <div className="w-full h-full bg-muted-foreground/20 rounded-full" />
                ) : (
                    <BrainCircuit size={16} />
                )}
            </div>
            <div className={`max-w-[85%] space-y-1`}>
                <div
                    className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        role === "user"
                            ? "bg-blue-600 text-white rounded-tr-sm"
                            : "bg-card border border-border text-foreground rounded-tl-sm"
                    }`}
                >
                    <div className="prose dark:prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-pre:bg-muted">
                        <ReactMarkDown>{content}</ReactMarkDown>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ChatLoadingBubble() {
    return (
        <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                <BrainCircuit size={16} />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 pt-1">
                    <div
                        className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                    />
                    <div
                        className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                    />
                    <div
                        className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                    />
                </div>
            </div>
        </div>
    );
}
