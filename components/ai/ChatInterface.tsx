"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    ArrowRight,
    Sparkles,
    Paperclip,
    FileText,
    Layers,
    Network,
    X,
    Loader2,
    Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/utils/cn";
import {
    sendChatMessage,
    createStudyNotes,
    createFlashcards,
    createKnowledgeTree,
} from "@/app/actions/ai";
import { FlashcardModal } from "./FlashcardModal";
import { ApiKeyModal } from "./ApiKeyModal";
import { RateLimitModal } from "./RateLimitModal";
import { AIFlashcard, AIStudyNote, AIKnowledgeNode } from "@/types/ai";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
    role: "user" | "model";
    parts: string;
    type?: "text" | "notes" | "flashcards" | "tree";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
}

export function ChatInterface({ children }: { children?: React.ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [context, setContext] = useState("");
    const [isParsing, setIsParsing] = useState(false);

    // API Key & Rate Limit states
    const [apiKey, setApiKey] = useState("");
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);
    const [showRateLimitModal, setShowRateLimitModal] = useState(false);

    // Modal states
    const [showFlashcards, setShowFlashcards] = useState(false);
    const [currentFlashcards, setCurrentFlashcards] = useState<AIFlashcard[]>(
        []
    );
    const [showNotes, setShowNotes] = useState(false);
    const [currentNotes, setCurrentNotes] = useState<AIStudyNote | null>(null);
    const [showTree, setShowTree] = useState(false);
    const [currentTree, setCurrentTree] = useState<AIKnowledgeNode | null>(
        null
    );

    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedKey = localStorage.getItem("gemini_api_key");
        if (storedKey) setApiKey(storedKey);
    }, []);

    const handleSaveApiKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem("gemini_api_key", key);
    };

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop =
                scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setIsParsing(true);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await fetch("/api/ai/parse", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to parse file");
            }

            const { text } = await response.json();

            if (text.startsWith("Error:")) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "user",
                        parts: `Uploaded file: ${selectedFile.name}`,
                    },
                    {
                        role: "model",
                        parts: `I encountered an issue with this file: ${text.substring(
                            7
                        )}. Please try uploading a valid PDF or text file.`,
                    },
                ]);
                setFile(null);
                setContext("");
            } else {
                setContext(text);
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "user",
                        parts: `Uploaded file: ${selectedFile.name}. I'm ready to study this material.`,
                    },
                    {
                        role: "model",
                        parts: `I've analyzed ${selectedFile.name}. What would you like to do? I can generate study notes, flashcards, or a knowledge tree, or you can just ask me questions about it.`,
                    },
                ]);
            }
        } catch (error: any) {
            console.error("Error parsing file:", error);
            if (
                error.message?.includes("Free tier quota exceeded") ||
                error.message?.includes("quota")
            ) {
                setShowRateLimitModal(true);
                setFile(null);
                return;
            }
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    parts: "Sorry, I encountered an error reading that file. Please try again.",
                },
            ]);
            setFile(null);
        } finally {
            setIsParsing(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() && !file) return;

        const userMessage = input;
        setInput("");
        setMessages((prev) => [...prev, { role: "user", parts: userMessage }]);
        setIsLoading(true);

        try {
            // Check for specific commands
            const lowerInput = userMessage.toLowerCase();
            if (
                lowerInput.includes("flashcard") ||
                lowerInput.includes("flash cards")
            ) {
                const cards = await createFlashcards(
                    context || userMessage,
                    apiKey
                );
                setCurrentFlashcards(cards);
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "model",
                        parts: "I've generated some flashcards for you.",
                        type: "flashcards",
                        data: cards,
                    },
                ]);
            } else if (
                lowerInput.includes("note") ||
                lowerInput.includes("summary")
            ) {
                const notes = await createStudyNotes(
                    context || userMessage,
                    apiKey
                );
                setCurrentNotes(notes);
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "model",
                        parts: "Here are your study notes.",
                        type: "notes",
                        data: notes,
                    },
                ]);
            } else if (
                lowerInput.includes("tree") ||
                lowerInput.includes("knowledge")
            ) {
                const tree = await createKnowledgeTree(
                    context || userMessage,
                    apiKey
                );
                setCurrentTree(tree);
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "model",
                        parts: "I've created a knowledge tree structure for this topic.",
                        type: "tree",
                        data: tree,
                    },
                ]);
            } else {
                // Regular chat
                const response = await sendChatMessage(
                    messages.map((m) => ({ role: m.role, parts: m.parts })),
                    userMessage,
                    context,
                    apiKey
                );
                setMessages((prev) => [
                    ...prev,
                    { role: "model", parts: response },
                ]);
            }
        } catch (error: any) {
            console.error("Error sending message:", error);
            if (
                error.message === "RATE_LIMIT_EXCEEDED" ||
                error.message?.includes("429") ||
                error.message?.includes("503") ||
                error.message?.includes("quota") ||
                error.message?.includes("Free tier quota exceeded")
            ) {
                setShowRateLimitModal(true);
                // Remove the user message that failed? Or keep it?
                // Keeping it allows retry.
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "model",
                        parts: "I'm currently experiencing high traffic. Please try again in a moment.",
                    },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "model",
                        parts: "Sorry, something went wrong. Please try again.",
                    },
                ]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative">
            <div className="flex items-center justify-between p-4  z-10">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                </h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowApiKeyModal(true)}
                    title="AI Settings"
                >
                    <Settings className="h-5 w-5" />
                </Button>
            </div>
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4 pb-4">
                    {messages.length === 0 && children}

                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex gap-3",
                                msg.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            )}
                        >
                            {msg.role === "model" && (
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                </div>
                            )}
                            <div
                                className={cn(
                                    "rounded-2xl px-4 py-2 max-w-[80%] text-sm",
                                    msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-secondary/50 border border-border/50 rounded-tl-none"
                                )}
                            >
                                <div className="prose dark:prose-invert max-w-none text-sm">
                                    <ReactMarkdown>{msg.parts}</ReactMarkdown>
                                </div>

                                {msg.type === "flashcards" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 w-full gap-2"
                                        onClick={() => {
                                            setCurrentFlashcards(msg.data);
                                            setShowFlashcards(true);
                                        }}
                                    >
                                        <Layers className="h-4 w-4" /> View
                                        Flashcards
                                    </Button>
                                )}

                                {msg.type === "notes" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 w-full gap-2"
                                        onClick={() => {
                                            setCurrentNotes(msg.data);
                                            setShowNotes(true);
                                        }}
                                    >
                                        <FileText className="h-4 w-4" /> View
                                        Notes
                                    </Button>
                                )}

                                {msg.type === "tree" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 w-full gap-2"
                                        onClick={() => {
                                            setCurrentTree(msg.data);
                                            setShowTree(true);
                                        }}
                                    >
                                        <Network className="h-4 w-4" /> View
                                        Knowledge Tree
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <div className="bg-secondary/50 border border-border/50 rounded-2xl rounded-tl-none px-4 py-2 flex items-center">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4">
                <div className="rounded-3xl border border-border/80 bg-card/90 shadow-xl backdrop-blur-sm p-4 sm:p-5 space-y-3">
                    {file && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg w-fit">
                            <FileText className="h-3 w-3" />
                            <span className="max-w-[200px] truncate">
                                {file.name}
                            </span>
                            <button
                                onClick={() => {
                                    setFile(null);
                                    setContext("");
                                }}
                                className="hover:text-foreground"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}

                    <div className="relative flex items-center">
                        <div className="absolute left-4 text-muted-foreground">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="hover:text-foreground transition-colors"
                                disabled={isParsing}
                            >
                                {isParsing ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Paperclip className="h-5 w-5" />
                                )}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".pdf,.txt,.md,.pptx"
                                onChange={handleFileChange}
                            />
                        </div>
                        <Input
                            className="h-14 sm:h-16 pl-12 pr-12 rounded-2xl border-border bg-secondary/40 text-base shadow-sm focus-visible:ring-primary/25 transition-all hover:bg-secondary/60 focus:bg-background"
                            placeholder="Ask CourseHub AI anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading || isParsing}
                        />
                        <div className="absolute right-3">
                            <Button
                                size="icon"
                                className="h-11 w-11 rounded-xl bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-all hover:scale-105"
                                onClick={handleSend}
                                disabled={
                                    isLoading ||
                                    isParsing ||
                                    (!input.trim() && !file)
                                }
                            >
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {[
                            "Summarize this",
                            "Create flashcards",
                            "Explain key concepts",
                            "Generate knowledge tree",
                        ].map((chip) => (
                            <button
                                key={chip}
                                onClick={() => setInput(chip)}
                                className="px-3 py-1.5 rounded-full border border-border/60 bg-secondary/50 hover:border-primary/40 hover:text-foreground transition-colors"
                            >
                                {chip}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <FlashcardModal
                isOpen={showFlashcards}
                onClose={() => setShowFlashcards(false)}
                flashcards={currentFlashcards}
            />

            <ApiKeyModal
                isOpen={showApiKeyModal}
                onClose={() => setShowApiKeyModal(false)}
                onSave={handleSaveApiKey}
                initialKey={apiKey}
            />

            <RateLimitModal
                isOpen={showRateLimitModal}
                onClose={() => setShowRateLimitModal(false)}
            />

            {/* Simple Notes Modal */}
            {showNotes && currentNotes && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-3xl max-h-[80vh] overflow-y-auto relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => setShowNotes(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <CardHeader>
                            <CardTitle>{currentNotes.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Summary</h3>
                                <p className="text-muted-foreground">
                                    {currentNotes.summary}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">
                                    Key Points
                                </h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    {currentNotes.keyPoints.map((point, i) => (
                                        <li key={i}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">
                                    Explanation
                                </h3>
                                <div className="prose dark:prose-invert max-w-none">
                                    <ReactMarkdown>
                                        {currentNotes.explanation}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Simple Tree Modal */}
            {showTree && currentTree && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-5xl max-h-[80vh] overflow-y-auto relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => setShowTree(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <CardHeader>
                            <CardTitle>Knowledge Tree</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TreeRenderer node={currentTree} />
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

function TreeRenderer({
    node,
    level = 0,
}: {
    node: AIKnowledgeNode;
    level?: number;
}) {
    return (
        <div className="ml-4">
            <div className="flex items-center gap-2 py-1">
                <div
                    className={`w-2 h-2 rounded-full ${
                        level === 0 ? "bg-primary" : "bg-muted-foreground"
                    }`}
                />
                <span className="font-medium">{node.label}</span>
                {node.description && (
                    <span className="text-sm text-muted-foreground">
                        - {node.description}
                    </span>
                )}
            </div>
            {node.children && (
                <div className="border-l border-border ml-1 pl-4">
                    {node.children.map((child) => (
                        <TreeRenderer
                            key={child.id}
                            node={child}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
