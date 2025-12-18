import React from "react";
import { Card } from "@/components/ui/card";

export function ResourceBannerSkeleton() {
    return (
        <div className="w-full border-b border-border/40">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                <div className="h-32 sm:h-48 w-full rounded-t-[2rem] bg-muted animate-pulse" />
            </div>
        </div>
    );
}

export function ResourceHeaderSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="space-y-2 flex-1 w-full max-w-2xl">
                    <div className="flex gap-2">
                        <div className="h-4 w-12 bg-muted rounded-full"></div>
                        <div className="h-4 w-16 bg-muted rounded-full"></div>
                    </div>
                    <div className="h-8 w-3/4 bg-muted rounded-xl"></div>
                    <div className="flex gap-3">
                        <div className="h-3 w-20 bg-muted rounded-lg"></div>
                        <div className="h-3 w-24 bg-muted rounded-lg"></div>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2.5 p-2 rounded-xl bg-muted/30 border border-border/40 w-48">
                    <div className="w-8 h-8 rounded-lg bg-muted"></div>
                    <div className="space-y-1 flex-1">
                        <div className="h-3 w-full bg-muted rounded"></div>
                        <div className="h-2 w-2/3 bg-muted rounded"></div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-3 py-2">
                <div className="h-9 w-24 bg-muted rounded-xl"></div>
                <div className="h-9 w-32 bg-muted rounded-xl"></div>
                <div className="h-9 w-28 bg-muted rounded-xl"></div>
            </div>
        </div>
    );
}

export function ResourceContentSkeleton() {
    return (
        <div className="space-y-10 animate-pulse">
            <div className="space-y-4">
                <div className="h-8 w-48 bg-muted rounded-xl"></div>
                <div className="space-y-3">
                    <div className="h-4 w-full bg-muted/60 rounded-lg"></div>
                    <div className="h-4 w-full bg-muted/60 rounded-lg"></div>
                    <div className="h-4 w-4/5 bg-muted/60 rounded-lg"></div>
                </div>
            </div>
            <div className="space-y-6">
                <div className="h-8 w-40 bg-muted rounded-xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-16 bg-muted rounded-2xl"
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function ResourceSidebarSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-7 w-32 bg-muted rounded-lg"></div>
                    <div className="h-4 w-16 bg-muted rounded-lg"></div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-24 bg-muted rounded-[1.5rem]"
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function RelatedResourcesSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                            <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CommentsSectionSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            <div className="h-4 w-full bg-gray-200 rounded"></div>
                            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
