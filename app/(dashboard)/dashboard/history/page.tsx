import React from "react";
import { RecentsList } from "@/components/dashboard/RecentsList";
import { listUserGenerations } from "@/app/actions/ai";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mapGenerationToRecentItem } from "@/lib/ai/mappers";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
    const generations = await listUserGenerations({ limit: 50 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = generations.map((gen: any) =>
        mapGenerationToRecentItem(gen, "You")
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/profile">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-serif font-bold text-[#0A251D]">
                    Your Generated Content
                </h1>
            </div>
            <RecentsList items={items} />
        </div>
    );
}
