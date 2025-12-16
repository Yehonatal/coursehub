"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AIFlashcard } from "@/types/ai";
import { cn } from "@/utils/cn";

interface FlashcardModalProps {
    isOpen: boolean;
    onClose: () => void;
    flashcards: AIFlashcard[];
}

export function FlashcardModal({
    isOpen,
    onClose,
    flashcards,
}: FlashcardModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground"
                    onClick={onClose}
                >
                    <X className="h-6 w-6" />
                </Button>

                <div className="flex flex-col items-center gap-6">
                    <div className="w-full text-center space-y-2">
                        <h2 className="text-2xl font-serif font-medium">
                            Flashcards
                        </h2>
                        <p className="text-muted-foreground">
                            Card {currentIndex + 1} of {flashcards.length}
                        </p>
                    </div>

                    <div
                        className="w-full aspect-3/2 cursor-pointer group"
                        onClick={handleFlip}
                    >
                        {!isFlipped ? (
                            <Card className="w-full h-full flex flex-col items-center justify-center p-8 text-center border-2 border-primary/10 shadow-xl bg-card transition-opacity duration-300">
                                <span className="absolute top-4 left-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Question
                                </span>
                                <p className="text-xl md:text-2xl font-medium leading-relaxed">
                                    {currentCard.front}
                                </p>
                                <div className="absolute bottom-4 text-xs text-muted-foreground flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <RotateCw className="h-3 w-3" /> Click to
                                    flip
                                </div>
                            </Card>
                        ) : (
                            <Card className="w-full h-full flex flex-col items-center justify-center p-8 text-center border-2 border-primary/10 shadow-xl bg-card transition-opacity duration-300">
                                <span className="absolute top-4 left-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Answer
                                </span>
                                <p className="text-xl md:text-2xl font-medium leading-relaxed text-primary">
                                    {currentCard.back ||
                                        "(No answer available)"}
                                </p>
                                {currentCard.tag && (
                                    <span className="absolute bottom-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                        {currentCard.tag}
                                    </span>
                                )}
                            </Card>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePrev}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button onClick={handleFlip} className="min-w-[100px]">
                            {isFlipped ? "Show Question" : "Show Answer"}
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNext}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
