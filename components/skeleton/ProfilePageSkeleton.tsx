import React from "react";
import { Card } from "@/components/ui/card";

export function ProfileHeaderSkeleton() {
    return (
        <div className="relative animate-pulse">
            <div className="h-48 w-full bg-gray-200 rounded-2xl"></div>
            <div className="px-4 md:px-8 pb-8">
                <div className="relative -mt-16 mb-6 flex flex-col md:flex-row items-end gap-6">
                    <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-white shrink-0"></div>
                    <div className="flex-1 space-y-2 mb-2 w-full">
                        <div className="h-8 w-48 bg-gray-200 rounded"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex gap-3 mb-2 w-full md:w-auto">
                        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                        <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
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
                <Card key={i} className="p-6 space-y-2 border-none bg-gray-50">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </Card>
            ))}
        </div>
    );
}

export function ProfileActivitySkeleton() {
    return (
        <Card className="p-6 space-y-6 animate-pulse border-none">
            <div className="h-6 w-40 bg-gray-200 rounded"></div>
            <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-full bg-gray-200 rounded"></div>
                            <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export function ProfileRecentsSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="h-6 w-48 bg-gray-200 rounded"></div>
                <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="h-64 bg-gray-100 border-none" />
                ))}
            </div>
        </div>
    );
}
