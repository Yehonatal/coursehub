"use client";

import React from "react";
import { RecentsList } from "@/components/dashboard/RecentsList";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { mapGenerationToRecentItem } from "@/lib/ai/mappers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProfileRecents({ generations }: { generations: any[] }) {
    if (!generations || generations.length === 0) {
        return (
            <div className="mb-8">
                <h3 className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">
                    Recents Created Content
                </h3>
                <div className="rounded-3xl border border-dashed border-border bg-card p-6 text-xs text-muted-foreground font-medium">
                    You haven't generated any content yet. Start a chat or use
                    the AI tools to create study materials.
                </div>
            </div>
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = generations.map((gen: any) =>
        mapGenerationToRecentItem(gen, gen.userName || "You")
    );

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                    Recents Created Content
                </h3>
                <Link href="/dashboard/history">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80 text-xs h-8"
                    >
                        Load All <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                </Link>
            </div>
            <RecentsList items={items} />
        </div>
    );
}
