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
            <div className="mb-12">
                <h3 className="text-sm font-bold text-[#0A251D]/70 mb-4">
                    Recents Created Content
                </h3>
                <div className="rounded-xl border border-dashed border-[#0A251D]/30 bg-white/60 p-6 text-sm text-[#0A251D]">
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
        <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#0A251D]/70">
                    Recents Created Content
                </h3>
                <Link href="/dashboard/history">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#0A251D] hover:text-[#0A251D]/80"
                    >
                        Load All <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
            <RecentsList items={items} />
        </div>
    );
}
