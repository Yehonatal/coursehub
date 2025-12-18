"use client";

import React from "react";
import { RecentsList } from "@/components/dashboard/RecentsList";
import { mapGenerationToRecentItem } from "@/lib/ai/mappers";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GeneratedContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generations: any[];
}

export function GeneratedContentModal({
    isOpen,
    onClose,
    generations,
}: GeneratedContentModalProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = generations.map((gen: any) =>
        mapGenerationToRecentItem(gen, "Community")
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <div className="p-8 flex flex-col h-full max-h-[85vh]">
                    <DialogHeader className="mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-foreground">
                                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 fill-primary/20 text-primary" />
                                </div>
                                <DialogTitle className="text-2xl font-serif font-semibold tracking-tight">
                                    Generated Content
                                </DialogTitle>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full hover:bg-primary/5 text-muted-foreground/40 hover:text-primary transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                        <RecentsList items={items} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
