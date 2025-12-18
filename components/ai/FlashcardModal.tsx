"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, RotateCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AIFlashcard } from "@/types/ai";
import { cn } from "@/utils/cn";
import { saveGeneration } from "@/app/actions/ai";
import { toast } from "sonner";

interface FlashcardModalProps {
    isOpen: boolean;
    onClose: () => void;
    flashcards: AIFlashcard[];
    resourceId?: string;
    resourceTitle?: string;
}

export function FlashcardModal({
    isOpen,
    onClose,
    flashcards,
    resourceId,
    resourceTitle,
}: FlashcardModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen || flashcards.length === 0) return null;

    const currentCard = flashcards[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex(
            (prev) => (prev - 1 + flashcards.length) % flashcards.length
        );
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveGeneration({
                generationType: "flashcards",
                content: flashcards,
                prompt: "Flashcards Session",
                resourceId,
                title: resourceTitle
                    ? `Flashcards - ${resourceTitle}`
                    : "Flashcards Session",
            });
            toast.success("Flashcards saved to history");
        } catch (error) {
            toast.error("Failed to save flashcards");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border-none overflow-hidden">
                <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                <RotateCw className="h-5 w-5 fill-primary/20" />
                            </div>
                            <h2 className="text-2xl font-serif font-semibold tracking-tight">
                                Flashcards
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="rounded-xl text-primary hover:bg-primary/5 font-medium"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isSaving ? "Saving..." : "Save to History"}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-primary/5 text-muted-foreground/40 hover:text-primary transition-colors"
                                onClick={onClose}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-8">
                        <div className="w-full text-center">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                                Card {currentIndex + 1} of {flashcards.length}
                            </p>
                        </div>

                        <div
                            className="w-full aspect-[16/10] cursor-pointer group relative"
                            onClick={handleFlip}
                        >
                            {!isFlipped ? (
                                <Card className="w-full h-full rounded-[2rem] flex flex-col items-center justify-center p-12 text-center border-none shadow-inner bg-muted/5 transition-all duration-300">
                                    <span className="absolute top-8 left-8 text-xs font-bold text-primary/40 uppercase tracking-widest">
                                        Question
                                    </span>
                                    <p className="text-2xl font-serif font-medium leading-relaxed text-primary">
                                        {currentCard.front}
                                    </p>
                                    <div className="absolute bottom-8 text-xs font-medium text-muted-foreground/40 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <RotateCw className="h-3 w-3" /> Click
                                        to flip
                                    </div>
                                </Card>
                            ) : (
                                <Card className="w-full h-full rounded-[2rem] flex flex-col items-center justify-center p-12 text-center border-none shadow-2xl bg-primary text-white transition-all duration-300 shadow-primary/20">
                                    <span className="absolute top-8 left-8 text-xs font-bold text-white/40 uppercase tracking-widest">
                                        Answer
                                    </span>
                                    <p className="text-2xl font-serif font-medium leading-relaxed">
                                        {currentCard.back ||
                                            "(No answer available)"}
                                    </p>
                                    {currentCard.tag && (
                                        <span className="absolute bottom-8 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white/90 backdrop-blur-sm">
                                            {currentCard.tag}
                                        </span>
                                    )}
                                </Card>
                            )}
                        </div>

                        <div className="flex items-center gap-6">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePrev}
                                className="h-12 w-12 rounded-full hover:bg-primary/5 text-primary transition-all"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleFlip}
                                className="px-8 h-12 rounded-xl border-primary/20 hover:bg-primary/5 text-primary font-semibold transition-all min-w-[160px]"
                            >
                                <RotateCw className="h-4 w-4 mr-2" />
                                {isFlipped ? "Show Question" : "Show Answer"}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleNext}
                                className="h-12 w-12 rounded-full hover:bg-primary/5 text-primary transition-all"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
