"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, Settings, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import {
    parseFile,
    sendChatMessage,
    createStudyNotes,
    createFlashcards,
    createKnowledgeTree,
} from "@/app/actions/ai";
import { FlashcardModal } from "./FlashcardModal";
import { ApiKeyModal } from "./ApiKeyModal";
import { RateLimitModal } from "./RateLimitModal";
import { AIFlashcard, AIStudyNote, AIKnowledgeNode } from "@/types/ai";
import { AIChatEmptyState } from "./chat/AIChatEmptyState";
import { AIChatMessage } from "./chat/AIChatMessage";
import { AIChatInput } from "./chat/AIChatInput";
import { AIStudyNoteModal } from "./chat/AIStudyNoteModal";
import { AIKnowledgeTreeModal } from "./chat/AIKnowledgeTreeModal";

interface AIChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    resourceTitle: string;
    resourceType: string;
    fileUrl?: string;
}

interface Message {
    role: "user" | "model";
    parts: string;
    type?: "text" | "notes" | "flashcards" | "tree";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
}

export function AIChatModal({
    isOpen,
    onClose,
    resourceTitle,
    resourceType,
    fileUrl,
}: AIChatModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
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

    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem("gemini_api_key");
        if (storedKey) setApiKey(storedKey);
    }, []);

    const handleSaveApiKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem("gemini_api_key", key);
    };

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
            // Reset state when opening
            if (messages.length === 0 && fileUrl) {
                loadFile();
            }
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = "unset";
            return () => clearTimeout(timer);
        }
    }, [isOpen, fileUrl]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop =
                scrollAreaRef.current.scrollHeight;
        }
    }, [messages, isLoading, isParsing]);

    const loadFile = async () => {
        if (!fileUrl) return;
        setIsParsing(true);
        try {
            // Fetch the file from the URL
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const file = new File([blob], resourceTitle, { type: blob.type });

            const formData = new FormData();
            formData.append("file", file);

            const text = await parseFile(formData);

            if (text.startsWith("Error:")) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "model",
                        parts: `I encountered an issue reading this resource: ${text.substring(
                            7
                        )}.`,
                    },
                ]);
                setContext("");
            } else {
                setContext(text);
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "model",
                        parts: `I've analyzed ${resourceTitle}. What would you like to do? I can generate study notes, flashcards, or a knowledge tree, or you can just ask me questions about it.`,
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
                return;
            }
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    parts: "Sorry, I encountered an error reading this resource. Please try again later.",
                },
            ]);
        } finally {
            setIsParsing(false);
        }
    };

    const handleSend = async (message?: string) => {
        const textToSend = message ?? inputValue;
        if (!textToSend.trim()) return;

        if (!message) setInputValue("");
        setMessages((prev) => [...prev, { role: "user", parts: textToSend }]);
        setIsLoading(true);

        try {
            // Check for specific commands
            const lowerInput = textToSend.toLowerCase();
            if (
                lowerInput.includes("flashcard") ||
                lowerInput.includes("flash cards")
            ) {
                const cards = await createFlashcards(
                    context || textToSend,
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
                lowerInput.includes("summary") ||
                lowerInput.includes("summarize")
            ) {
                const notes = await createStudyNotes(
                    context || textToSend,
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
                lowerInput.includes("knowledge") ||
                lowerInput.includes("map")
            ) {
                const tree = await createKnowledgeTree(
                    context || textToSend,
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
                    textToSend,
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
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "model",
                        parts: "I'm currently experiencing high traffic or you've exceeded your quota. Please try again later.",
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

    const cardClass = cn(
        "relative w-full rounded-2xl max-w-4xl flex flex-col bg-white shadow-xl border-0 overflow-hidden transition-all duration-300 transform",
        isFullscreen
            ? "absolute inset-0 m-0 w-full h-full max-w-none rounded-none"
            : isOpen
            ? "scale-100 translate-y-0"
            : "scale-95 translate-y-4"
    );

    const cardStyle = isFullscreen
        ? { height: "100vh", maxHeight: "100vh" }
        : { height: "650px", maxHeight: "90vh" };

    if (!isVisible) return null;

    return (
        <>
            <div
                className={cn(
                    "fixed inset-0  z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
            >
                <div
                    className="absolute inset-0 scale-200 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                <Card className={cardClass} style={cardStyle}>
                    <div className="flex items-center justify-between px-6 py-4 border-b bg-white shrink-0">
                        <div>
                            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                AI Assistant
                            </h2>
                            <p className="text-xl font-semibold text-[#0A251D]">
                                Chat with {resourceTitle}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowApiKeyModal(true)}
                                className="h-8 w-8 rounded-full hover:bg-gray-100"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsFullscreen((s) => !s)}
                                className="h-8 w-8 rounded-full hover:bg-gray-100"
                                aria-pressed={isFullscreen}
                            >
                                {isFullscreen ? (
                                    <Minimize2 className="h-4 w-4" />
                                ) : (
                                    <Maximize2 className="h-4 w-4" />
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="h-8 w-8 rounded-full hover:bg-gray-100"
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </div>
                    </div>

                    <div
                        ref={scrollAreaRef}
                        className="flex-1 flex flex-col p-8 pb-6 space-y-6 overflow-y-auto bg-[#F8F9FA]"
                    >
                        <AIChatEmptyState
                            resourceTitle={resourceTitle}
                            resourceType={resourceType}
                            onCommand={handleSend}
                            isParsing={isParsing}
                        />

                        {messages.map((msg, index) => (
                            <AIChatMessage
                                key={index}
                                message={msg}
                                onViewFlashcards={(cards) => {
                                    setCurrentFlashcards(cards);
                                    setShowFlashcards(true);
                                }}
                                onViewNotes={(notes) => {
                                    setCurrentNotes(notes);
                                    setShowNotes(true);
                                }}
                                onViewTree={(tree) => {
                                    setCurrentTree(tree);
                                    setShowTree(true);
                                }}
                            />
                        ))}

                        {isParsing && (
                            <div className="flex justify-start w-full">
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-[#0A251D]" />
                                    <span className="text-sm text-gray-600">
                                        Analyzing resource...
                                    </span>
                                </div>
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex justify-start w-full">
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-[#0A251D]" />
                                    <span className="text-sm text-gray-600">
                                        Thinking...
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <AIChatInput
                        value={inputValue}
                        onChange={setInputValue}
                        onSend={() => handleSend()}
                        isLoading={isLoading}
                        isParsing={isParsing}
                    />
                </Card>
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

            <AIStudyNoteModal
                isOpen={showNotes}
                onClose={() => setShowNotes(false)}
                note={currentNotes}
            />

            <AIKnowledgeTreeModal
                isOpen={showTree}
                onClose={() => setShowTree(false)}
                tree={currentTree}
            />
        </>
    );
}
