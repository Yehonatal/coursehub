"use client";

import React from "react";
import { RecentsList } from "@/components/dashboard/RecentsList";
import { mapGenerationToRecentItem } from "@/lib/ai/mappers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ResourceGenerations({ generations }: { generations: any[] }) {
    if (!generations || generations.length === 0) return null;

    const items = generations.map((gen: any) =>
        mapGenerationToRecentItem(gen, gen.userName || "You")
    );

    return (
        <div className="mt-8">
            <h3 className="text-xl font-serif font-bold text-foreground mb-4">
                Community Generated Content
            </h3>
            <RecentsList items={items} />
        </div>
    );
}
