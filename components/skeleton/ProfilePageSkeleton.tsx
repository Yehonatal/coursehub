import React from "react";
import { Card } from "@/components/ui/card";

export function ProfileHeaderSkeleton() {
    return (
        <div className="relative animate-pulse mb-6">
            <div className="h-20 sm:h-28 w-full bg-muted rounded-t-[2rem]"></div>
            <div className="px-6 sm:px-10 pb-2">
                <div className="relative -mt-8 md:-mt-12 mb-4 flex flex-col md:flex-row items-end gap-4">
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-muted border-4 border-white shrink-0"></div>
                    <div className="flex-1 space-y-2 mb-1 w-full">
                        <div className="h-6 w-40 bg-muted rounded-lg"></div>
                        <div className="h-3 w-24 bg-muted rounded-lg"></div>
                    </div>
                    <div className="flex gap-2 mb-1 w-full md:w-auto">
                        <div className="h-8 w-8 bg-muted rounded-xl"></div>
                        <div className="h-8 w-24 bg-muted rounded-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ProfileStatsSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className="p-6 space-y-2 rounded-[2rem] bg-muted/30 border border-border/40"
                >
                    <div className="h-4 w-24 bg-muted rounded-lg"></div>
                    <div className="h-8 w-16 bg-muted rounded-lg"></div>
                </div>
            ))}
        </div>
    );
}

export function ProfileActivitySkeleton() {
    return (
        <div className="p-6 space-y-6 animate-pulse rounded-[2rem] bg-muted/30 border border-border/40">
            <div className="h-6 w-40 bg-muted rounded-lg"></div>
            <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-muted shrink-0"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-full bg-muted rounded-lg"></div>
                            <div className="h-3 w-24 bg-muted rounded-lg"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ProfileRecentsSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="h-6 w-48 bg-muted rounded-lg"></div>
                <div className="flex gap-2">
                    <div className="h-8 w-8 bg-muted rounded-full"></div>
                    <div className="h-8 w-8 bg-muted rounded-full"></div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-64 bg-muted/30 rounded-[2rem] border border-border/40"
                    />
                ))}
            </div>
        </div>
    );
}
