"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
    X,
    Loader2,
    Settings,
    Maximize2,
    Minimize2,
    RefreshCw,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    resourceId?: string;
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
    resourceId,
}: AIChatModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [context, setContext] = useState("");
    const [isParsing, setIsParsing] = useState(false);

    // API Key, model & Rate Limit states
    const [apiKey, setApiKey] = useState("");
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
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
        if (storedKey) {
            setApiKey(storedKey);
        } else if (isOpen) {
            setShowApiKeyModal(true);
        }
        const storedModel = localStorage.getItem("gemini_model");
        if (storedModel) setSelectedModel(storedModel);
    }, [isOpen]);

    const handleSaveApiKey = (key: string, model?: string) => {
        setApiKey(key);
        localStorage.setItem("gemini_api_key", key);
        if (model) {
            setSelectedModel(model);
            localStorage.setItem("gemini_model", model);
        }
    };

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop =
                scrollAreaRef.current.scrollHeight;
        }
    }, [messages, isLoading, isParsing]);

    const loadFile = useCallback(async () => {
        if (!fileUrl) return;
        setIsParsing(true);
        try {
            // Fetch the file from the URL
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const file = new File([blob], resourceTitle, { type: blob.type });

            const formData = new FormData();
            formData.append("file", file);

            const parseResponse = await fetch("/api/ai/parse", {
                method: "POST",
                body: formData,
            });

            if (!parseResponse.ok) {
                throw new Error("Failed to parse file");
            }

            const { text } = await parseResponse.json();

            if (text.startsWith("Error:")) {
                // Friendly message already returned by the API
                const friendly =
                    "We couldn't parse this file right now. Please try again later — our team is investigating.";
                setMessages((prev) => [
                    ...prev.filter(
                        (m) =>
                            !(
                                m.role === "model" &&
                                (m.parts.includes("I've analyzed") ||
                                    m.parts.includes("Analyzing") ||
                                    m.parts.includes("Re-analyzing"))
                            )
                    ),
                    {
                        role: "model",
                        parts: `I encountered an issue reading this resource: ${text.substring(
                            7
                        )}.`,
                    },
                ]);
                setContext("");

                // Show failure toast (professional)
                toast.error(friendly);
            } else {
                setContext(text);

                // Clear existing analysis messages (avoid duplicates) then append fresh analysis message
                const successMsg = `Analysis complete for ${resourceTitle}. What would you like to do next? I can generate study notes, flashcards, a knowledge tree, or answer questions about this resource.`;
                setMessages((prev) => [
                    ...prev.filter(
                        (m) =>
                            !(
                                m.role === "model" &&
                                (m.parts.includes("I've analyzed") ||
                                    m.parts.includes("Analyzing") ||
                                    m.parts.includes("Re-analyzing") ||
                                    m.parts.includes(
                                        "I encountered an issue reading this resource"
                                    ))
                            )
                    ),
                    {
                        role: "model",
                        parts: successMsg,
                    },
                ]);

                // Success toast (professional)
                toast.success(
                    "Analysis complete — you can now ask questions or generate study materials."
                );
            }
        } catch (error: unknown) {
            console.error("Error parsing file:", error);
            const msg = error instanceof Error ? error.message : String(error);
            if (
                msg.includes("Free tier quota exceeded") ||
                msg.includes("quota")
            ) {
                setShowRateLimitModal(true);
                return;
            }

            // Friendly chat message + toast
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    parts: "Sorry, we couldn't parse your PDF right now. Please try again later — we're working on a fix.",
                },
            ]);

            toast.error(
                "Sorry, we couldn't parse your PDF right now. Please try again later — we're working on a fix."
            );
        } finally {
            setIsParsing(false);
        }
    }, [fileUrl, resourceTitle]);

    const handleReload = useCallback(async () => {
        if (!fileUrl) return;

        // Remove previous analysis messages to avoid duplicates
        setMessages((prev) =>
            prev.filter(
                (m) =>
                    !(
                        m.role === "model" &&
                        (m.parts.includes("I've analyzed") ||
                            m.parts.includes("Analyzing") ||
                            m.parts.includes("Re-analyzing") ||
                            m.parts.includes(
                                "I encountered an issue reading this resource"
                            ))
                    )
            )
        );

        // Add a user-facing temporary message and re-run the analysis
        setMessages((prev) => [
            ...prev,
            { role: "model", parts: `Re-analyzing ${resourceTitle}...` },
        ]);

        // Inform the user explicitly
        toast("Re-analysis started — we'll notify you when it's complete.");

        await loadFile();
    }, [fileUrl, resourceTitle, loadFile]);

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
    }, [isOpen, fileUrl, messages.length, loadFile]);

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
                    apiKey,
                    selectedModel ?? undefined
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
                    apiKey,
                    selectedModel ?? undefined
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
                    apiKey,
                    selectedModel ?? undefined
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
                    apiKey,
                    selectedModel ?? undefined
                );
                setMessages((prev) => [
                    ...prev,
                    { role: "model", parts: response },
                ]);
            }
        } catch (error: unknown) {
            console.error("Error sending message:", error);
            const errMsg =
                error instanceof Error ? error.message : String(error);
            if (
                errMsg === "RATE_LIMIT_EXCEEDED" ||
                errMsg.includes("429") ||
                errMsg.includes("503") ||
                errMsg.includes("quota") ||
                errMsg.includes("Free tier quota exceeded")
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
        "relative w-full rounded-2xl max-w-4xl flex flex-col bg-card shadow-xl border-0 overflow-hidden transition-all duration-300 transform",
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

                <Card
                    className={cn(
                        cardClass,
                        "rounded-3xl overflow-hidden border border-border shadow-2xl"
                    )}
                    style={cardStyle}
                >
                    <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-card shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Sparkles className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                    AI Assistant
                                </h2>
                                <p className="text-xl font-serif font-semibold text-foreground">
                                    {resourceTitle}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {fileUrl && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleReload}
                                    disabled={isParsing}
                                    className="h-10 w-10 rounded-full hover:bg-primary/5 text-muted-foreground/60 hover:text-primary transition-colors"
                                >
                                    {isParsing ? (
                                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                    ) : (
                                        <RefreshCw className="h-5 w-5" />
                                    )}
                                    <span className="sr-only">
                                        Reload resource
                                    </span>
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowApiKeyModal(true)}
                                className="h-10 w-10 rounded-full hover:bg-primary/5 text-muted-foreground/60 hover:text-primary transition-colors"
                            >
                                <Settings className="h-5 w-5" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsFullscreen((s) => !s)}
                                className="h-10 w-10 rounded-full hover:bg-primary/5 text-muted-foreground/60 hover:text-primary transition-colors"
                                aria-pressed={isFullscreen}
                            >
                                {isFullscreen ? (
                                    <Minimize2 className="h-5 w-5" />
                                ) : (
                                    <Maximize2 className="h-5 w-5" />
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="h-10 w-10 rounded-full hover:bg-primary/5 text-muted-foreground/60 hover:text-primary transition-colors"
                            >
                                <X className="h-5 w-5" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </div>
                    </div>

                    <div
                        ref={scrollAreaRef}
                        className="flex-1 flex flex-col p-8 pb-6 space-y-6 overflow-y-auto bg-muted/30 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
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
                                <div className="bg-card border border-border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    <span className="text-sm text-muted-foreground">
                                        Analyzing resource...
                                    </span>
                                </div>
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex justify-start w-full">
                                <div className="bg-card border border-border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    <span className="text-sm text-muted-foreground">
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
                resourceId={resourceId}
                resourceTitle={resourceTitle}
            />

            <ApiKeyModal
                isOpen={showApiKeyModal}
                onClose={() => setShowApiKeyModal(false)}
                onSave={handleSaveApiKey}
                initialKey={apiKey}
                initialModel={selectedModel ?? undefined}
            />

            <RateLimitModal
                isOpen={showRateLimitModal}
                onClose={() => setShowRateLimitModal(false)}
            />

            <AIStudyNoteModal
                isOpen={showNotes}
                onClose={() => setShowNotes(false)}
                note={currentNotes}
                resourceId={resourceId}
                resourceTitle={resourceTitle}
            />

            <AIKnowledgeTreeModal
                isOpen={showTree}
                onClose={() => setShowTree(false)}
                tree={currentTree}
                resourceId={resourceId}
                resourceTitle={resourceTitle}
            />
        </>
    );
}
