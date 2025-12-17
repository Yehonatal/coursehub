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
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif font-bold text-[#0A251D]">
                        Generated Content
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <RecentsList items={items} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
