import React from "react";
import { RecentsList } from "@/components/dashboard/RecentsList";
import { listUserGenerations } from "@/app/actions/ai";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HistoryPage() {
    const generations = await listUserGenerations({ limit: 50 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = generations.map((gen: any) => ({
        title:
            gen.title ||
            gen.prompt?.substring(0, 30) +
                (gen.prompt?.length > 30 ? "..." : "") ||
            "Untitled",
        type:
            gen.generationType === "notes"
                ? "Note"
                : gen.generationType === "tree"
                ? "Knowledge Tree"
                : "Flashcards",
        meta: new Date(gen.createdAt).toLocaleDateString(),
        author: "You",
        iconType:
            gen.generationType === "notes"
                ? "note"
                : gen.generationType === "tree"
                ? "tree"
                : "question",
        data: gen.content,
    }));

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
