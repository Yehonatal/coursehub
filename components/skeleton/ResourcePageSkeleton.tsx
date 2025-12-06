import React from "react";
import { Card } from "@/components/ui/card";

export function ResourceBannerSkeleton() {
    return (
        <div className="w-full border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="h-32 sm:h-48 w-full rounded-t-xl bg-gray-200 animate-pulse" />
            </div>
        </div>
    );
}

export function ResourceHeaderSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="space-y-4 w-full max-w-2xl">
                    <div className="h-10 w-3/4 bg-gray-200 rounded-lg"></div>
                    <div className="flex gap-3">
                        <div className="h-5 w-24 bg-gray-200 rounded"></div>
                        <div className="h-5 w-32 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap gap-3 border-t border-b border-gray-100 py-4">
                <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>
                <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
    );
}

export function ResourceContentSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="space-y-4">
                <div className="h-6 w-40 bg-gray-200 rounded"></div>
                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>
            </div>
            <div className="space-y-4">
                <div className="h-6 w-40 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-12 bg-gray-200 rounded-lg"
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function ResourceSidebarSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <Card className="p-6 space-y-6 border-none bg-gray-50">
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex justify-between">
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
                <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
            </Card>
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
