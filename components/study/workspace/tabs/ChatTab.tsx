"use client";

import { Send, Sparkles, Link, Upload, Bot } from "lucide-react";
import { useEffect, useRef } from "react";
import { ChatMessage, ChatLoadingBubble } from "./chat/ChatMessage";

interface ChatTabProps {
    messages: { role: string; content: string }[];
    isLoading: boolean;
    inputValue: string;
    setInputValue: (val: string) => void;
    onSendMessage: () => void;
    suggestedQuestions: string[];
}

export function ChatTab({
    messages,
    isLoading,
    inputValue,
    setInputValue,
    onSendMessage,
    suggestedQuestions,
}: ChatTabProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    if (messages.length === 0) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Bot className="text-white w-10 h-10" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-[3px] border-background"></div>
                    </div>

                    <div className="space-y-2 max-w-sm">
                        <h3 className="text-lg font-semibold text-foreground">
                            Hi I'm Huby, let's start studying!
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Ask me anything about your materials, explanations,
                            tutoring, etc
                        </p>
                    </div>

                    <div className="flex gap-2 justify-center flex-wrap max-w-md">
                        {suggestedQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setInputValue(q);
                                    // Small delay to ensure state update before send
                                    setTimeout(onSendMessage, 0);
                                }}
                                className="px-4 py-2 text-xs font-medium bg-card border border-border rounded-full text-muted-foreground hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all shadow-sm"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
                <ChatInput
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    onSendMessage={onSendMessage}
                    isLoading={isLoading}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div
                className="flex-1 overflow-y-auto p-4 space-y-6"
                ref={scrollRef}
            >
                {messages.map((msg, i) => (
                    <ChatMessage
                        key={i}
                        role={msg.role}
                        content={msg.content}
                    />
                ))}
                {isLoading && <ChatLoadingBubble />}
            </div>

            <ChatInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSendMessage={onSendMessage}
                isLoading={isLoading}
            />
        </div>
    );
}

function ChatInput({
    inputValue,
    setInputValue,
    onSendMessage,
    isLoading,
}: any) {
    return (
        <div className="p-4 bg-card border-t border-border shrink-0">
            <div className="relative flex flex-col gap-2 p-3 rounded-xl border border-border bg-card shadow-sm focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500/50 transition-all">
                <textarea
                    rows={1}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            onSendMessage();
                        }
                    }}
                    placeholder="Ask Huby anything.."
                    className="w-full py-2 pl-1 bg-transparent border-none focus:ring-0 text-sm text-foreground placeholder:text-muted-foreground resize-none min-h-[40px] max-h-[120px]"
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                    }}
                />

                <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-1">
                        <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                            <Upload size={16} />
                        </button>
                        <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                            <Link size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md text-[10px] font-medium text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors">
                            <Sparkles size={12} />
                            GPT-5 Mini
                        </div>
                        <button
                            disabled={!inputValue.trim() || isLoading}
                            onClick={onSendMessage}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground transition-all shadow-sm"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
