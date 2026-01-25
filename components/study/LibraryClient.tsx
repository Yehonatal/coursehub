"use client";

import React, { useState } from "react";
import {
    Search,
    Plus,
    Filter,
    MoreHorizontal,
    FileText,
    Layers,
    FileQuestion,
    GraduationCap,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { UserResource } from "@/lib/dal/study";
import { formatDistanceToNow } from "date-fns";

// Helper for icon based on file type/category (simple mapping)
const getResourceIcon = (resource: UserResource) => {
    // Default fallback
    return <FileText className="w-6 h-6 text-blue-500" />;
};

export default function LibraryClient({
    initialResources,
}: {
    initialResources: UserResource[];
}) {
    const [activeTab, setActiveTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [resources, setResources] =
        useState<UserResource[]>(initialResources);

    const tabs = ["All", "Study Workspaces", "Study Plans", "Recording/Notes"];

    // Filter resources based on search and active tab
    const filteredResources = resources.filter((res) => {
        const matchesSearch = res.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        // For now, tab filtering is basic or ignored if we don't have category field matching closely
        // But we can implement basic logic if needed.
        const matchesTab = activeTab === "All" || true; // TODO: Implement category filtering
        return matchesSearch && matchesTab;
    });

    return (
        <div className="flex flex-col h-full bg-background/50">
            <div className="flex-1 flex flex-col p-8  mx-auto w-full space-y-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-serif font-bold tracking-tight">
                        My Library
                    </h1>
                    <p className="text-muted-foreground">
                        View all your study resources here
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-6 border-b border-border/50">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "pb-3 text-sm font-medium transition-all relative",
                                    activeTab === tab
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search all..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 pl-9 pr-4 rounded-xl border border-border/50 bg-muted/20 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button className="h-10 px-4 rounded-xl border border-border/50 hover:bg-muted/50 flex items-center gap-2 text-sm font-medium transition-colors">
                                <span>Sort: Newest first</span>
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </button>

                            <button className="h-10 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-primary/25">
                                <Plus className="w-4 h-4" />
                                <span>Generate</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    {filteredResources.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
                            <Layers className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">
                                No resources found
                            </p>
                            <p className="text-sm">
                                Try uploading or generating some study
                                materials.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-card border border-border/50 rounded-xl divide-y divide-border/50 shadow-sm overflow-hidden">
                            {filteredResources.map((resource) => (
                                <div
                                    key={resource.resource_id}
                                    className="p-4 flex items-start gap-4 hover:bg-muted/30 transition-colors group cursor-pointer"
                                >
                                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-200/20">
                                        <FileText className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                                            {resource.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                            <span>
                                                {resource.upload_date
                                                    ? formatDistanceToNow(
                                                          new Date(
                                                              resource.upload_date,
                                                          ),
                                                          { addSuffix: true },
                                                      )
                                                    : "Unknown date"}
                                            </span>
                                            <span>•</span>
                                            <span className="capitalize">
                                                {resource.resource_type}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="p-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ChevronDown({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}
