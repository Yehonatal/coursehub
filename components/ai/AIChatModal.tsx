"use client";

import React, { useState, useEffect } from "react";
import {
    X,
    Lightbulb,
    HelpCircle,
    FileText,
    Network,
    ArrowUp,
    Presentation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";

interface AIChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    resourceTitle: string;
    resourceType: string;
}

export function AIChatModal({
    isOpen,
    onClose,
    resourceTitle,
    resourceType,
}: AIChatModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = "unset";
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
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
                    "relative w-full rounded-2xl max-w-4xl flex flex-col bg-white shadow-xl border-0 overflow-hidden transition-all duration-300 transform",
                    isOpen
                        ? "scale-100 translate-y-0"
                        : "scale-95 translate-y-4"
                )}
                style={{ height: "650px", maxHeight: "90vh" }}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b bg-white shrink-0">
                    <div>
                        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            AI Assistant
                        </h2>
                        <p className="text-xl font-semibold text-[#0A251D]">
                            Chat with {resourceTitle}
                        </p>
                    </div>
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

                <div className="flex-1 flex flex-col justify-end p-8 pb-6 space-y-6 overflow-y-auto bg-[#F8F9FA]">
                    <div className="w-full flex flex-col items-end space-y-4 max-w-4xl mx-auto">
                        <div className="bg-white p-3 pr-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3 w-fit max-w-md transition-transform hover:scale-[1.02] cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
                                <Presentation className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                                    {resourceTitle}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium">
                                    {resourceType}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-all group shadow-sm">
                                <Lightbulb className="w-4 h-4 text-yellow-500 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                                    Make flashcards
                                </span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all group shadow-sm">
                                <HelpCircle className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                                    Quiz me
                                </span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group shadow-sm">
                                <FileText className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                                    Summarize this
                                </span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all group shadow-sm">
                                <Network className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                                    Map this topic
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border-t shrink-0">
                    <div className="relative bg-gray-100 rounded-3xl p-4 transition-all focus-within:ring-2 focus-within:ring-[#0A251D]/10 focus-within:bg-white border border-transparent focus-within:border-gray-200">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Need flashcards, summaries, or quiz questions? Just ask."
                            className="w-full bg-transparent border-none p-0 text-gray-700 placeholder:text-gray-500 focus:ring-0 resize-none min-h-[60px] text-base"
                            rows={2}
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                className={cn(
                                    "p-2 rounded-full transition-all duration-200 border border-transparent",
                                    inputValue.trim()
                                        ? "bg-[#0A251D] text-white hover:bg-[#0A251D]/90 shadow-md"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                )}
                                disabled={!inputValue.trim()}
                            >
                                <ArrowUp className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
