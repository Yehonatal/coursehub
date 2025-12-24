"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
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
    createChatSession,
    appendChatMessage,
    saveChatSession,
    clearChatSession,
} from "@/app/actions/ai";
import { FlashcardModal } from "./FlashcardModal";
import { ApiKeyModal } from "./ApiKeyModal";
import { RateLimitModal } from "./RateLimitModal";
import { AIFlashcard, AIStudyNote, AIKnowledgeNode } from "@/types/ai";
import ReactMarkdown from "react-markdown";
import { AIStudyNoteModal } from "./chat/AIStudyNoteModal";
import { AIKnowledgeTreeModal } from "./chat/AIKnowledgeTreeModal";

interface Message {
    role: "user" | "model";
    parts: string;
    type?: "text" | "notes" | "flashcards" | "tree";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
}

interface ChatInterfaceProps {
    children?: React.ReactNode;
    resourceId?: string;
    resourceTitle?: string;
}

export function ChatInterface({
    children,
    resourceId,
    resourceTitle,
}: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
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
    const [sessionId, setSessionId] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedKey = localStorage.getItem("gemini_api_key");
        if (storedKey) {
            setApiKey(storedKey);
        } else {
            setShowApiKeyModal(true);
        }
        const storedModel = localStorage.getItem("gemini_model");
        if (storedModel) setSelectedModel(storedModel);
    }, []);

    const handleSaveApiKey = (key: string, model?: string) => {
        setApiKey(key);
        localStorage.setItem("gemini_api_key", key);
        if (model) {
            setSelectedModel(model);
            localStorage.setItem("gemini_model", model);
        }
    };

    const handleSaveSession = async () => {
        if (!sessionId) return;
        try {
            await saveChatSession(sessionId);
            toast.success("Chat session saved!");
        } catch (error) {
            toast.error("Failed to save session");
        }
    };

    const handleClearSession = async () => {
        if (confirm("Are you sure you want to clear the chat?")) {
            if (sessionId) {
                try {
                    await clearChatSession(sessionId);
                } catch (error) {
                    console.error("Failed to clear session on server", error);
                }
            }
            setMessages([]);
            toast.success("Chat cleared");
        }
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

            const json = await api.ai.parse(formData);

            if (!json.success) {
                throw new Error("Failed to parse file");
            }

            const { text } = json.data;

            if (text.startsWith("Error:")) {
                const friendly =
                    "We couldn't parse this file right now. Please try again later — our team is investigating.";
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
                        )}.`,
                    },
                ]);
                setFile(null);
                setContext("");

                toast.error(friendly);
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
                        parts: `Analysis complete for ${selectedFile.name}. What would you like to do next? I can generate study notes, flashcards, a knowledge tree, or answer questions about the file.`,
                    },
                ]);

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
                setFile(null);
                return;
            }

            const friendly =
                "We couldn't parse this file right now. Please try again later — our team is investigating.";
            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    parts: friendly,
                },
            ]);
            toast.error(friendly);
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
            // Session Management
            let currentSessionId = sessionId;
            if (!currentSessionId) {
                try {
                    const session = await createChatSession(
                        resourceId,
                        resourceTitle
                            ? `${resourceTitle} - Chat`
                            : userMessage.substring(0, 30) + "..."
                    );
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    currentSessionId = (session as any)._id;
                    setSessionId(currentSessionId);
                } catch (e) {
                    console.error("Failed to create session", e);
                }
            }

            if (currentSessionId) {
                try {
                    await appendChatMessage(currentSessionId, {
                        role: "user",
                        text: userMessage,
                    });
                } catch (e) {
                    console.error("Failed to append user message", e);
                }
            }

            // Check for specific commands
            const lowerInput = userMessage.toLowerCase();
            let responseMessage: Message | null = null;

            if (
                lowerInput.includes("flashcard") ||
                lowerInput.includes("flash cards")
            ) {
                const cards = await createFlashcards(
                    context || userMessage,
                    apiKey,
                    selectedModel ?? undefined
                );
                setCurrentFlashcards(cards);
                responseMessage = {
                    role: "model",
                    parts: "I've generated some flashcards for you.",
                    type: "flashcards",
                    data: cards,
                };
            } else if (
                lowerInput.includes("note") ||
                lowerInput.includes("summary")
            ) {
                const notes = await createStudyNotes(
                    context || userMessage,
                    apiKey,
                    selectedModel ?? undefined
                );
                setCurrentNotes(notes);
                responseMessage = {
                    role: "model",
                    parts: "Here are your study notes.",
                    type: "notes",
                    data: notes,
                };
            } else if (
                lowerInput.includes("tree") ||
                lowerInput.includes("knowledge")
            ) {
                const tree = await createKnowledgeTree(
                    context || userMessage,
                    apiKey,
                    selectedModel ?? undefined
                );
                setCurrentTree(tree);
                responseMessage = {
                    role: "model",
                    parts: "I've created a knowledge tree structure for this topic.",
                    type: "tree",
                    data: tree,
                };
            } else {
                // Regular chat
                const response = await sendChatMessage(
                    messages.map((m) => ({ role: m.role, parts: m.parts })),
                    userMessage,
                    context,
                    apiKey,
                    selectedModel ?? undefined
                );
                responseMessage = { role: "model", parts: response };
            }

            if (responseMessage) {
                setMessages((prev) => [...prev, responseMessage!]);

                if (currentSessionId) {
                    try {
                        await appendChatMessage(currentSessionId, {
                            role: "model",
                            text: responseMessage.parts,
                            type: responseMessage.type,
                            meta: responseMessage.data,
                        });
                    } catch (e) {
                        console.error("Failed to append model message", e);
                    }
                }
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
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative overflow-hidden">
            <div className="flex items-center justify-between p-4  z-10">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                </h2>
                <div className="flex items-center gap-2">
                    {messages.length > 0 && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSaveSession}
                                title="Save Session"
                            >
                                Save
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearSession}
                                title="Clear Chat"
                            >
                                Clear
                            </Button>
                        </>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowApiKeyModal(true)}
                        title="AI Settings"
                    >
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            <ScrollArea className="flex-1 p-4 min-h-0" ref={scrollAreaRef}>
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
                                    "rounded-2xl px-4 py-2 max-w-[80%] text-sm shadow-sm",
                                    msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-card border border-border rounded-tl-none text-foreground"
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
                            <div className="bg-card border border-border rounded-2xl rounded-tl-none px-4 py-2 flex items-center shadow-sm">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4">
                <div className="rounded-3xl border border-border bg-card shadow-xl p-4 sm:p-5 space-y-3">
                    {file && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg w-fit border border-border">
                            <FileText className="h-3 w-3" />
                            <span className="max-w-[200px] truncate">
                                {file.name}
                            </span>
                            <button
                                onClick={() => {
                                    setFile(null);
                                    setContext("");
                                }}
                                className="hover:text-foreground transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}

                    <div className="relative flex items-center">
                        <div className="absolute left-4 text-muted-foreground z-10">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="hover:text-primary transition-colors"
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
                            className="h-14 sm:h-16 pl-12 pr-14 rounded-2xl border-border bg-muted/50 text-base shadow-sm focus-visible:ring-primary/20 transition-all hover:bg-muted focus:bg-background"
                            placeholder="Ask CourseHub AI anything..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading || isParsing}
                        />
                        <div className="absolute right-2">
                            <Button
                                size="icon"
                                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
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
                                className="px-3 py-1.5 rounded-full border border-border bg-muted/50 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all"
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
                resourceId={resourceId}
                resourceTitle={resourceTitle}
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
        </div>
    );
}
