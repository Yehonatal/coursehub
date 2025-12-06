import React from "react";
import { Card } from "@/components/ui/card";

export function DashboardSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
            {/* Left Column Skeleton */}
            <div className="lg:col-span-3 space-y-8">
                <Card className="h-80 bg-gray-100 border-none" />
                <div className="space-y-4">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <Card className="h-40 bg-gray-100 border-none" />
                </div>
            </div>

            {/* Middle Column Skeleton */}
            <div className="lg:col-span-6 space-y-10">
                <div className="space-y-4">
                    <div className="h-8 w-40 bg-gray-200 rounded"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-20 bg-gray-100 rounded-xl"
                            ></div>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="h-8 w-60 bg-gray-200 rounded"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Card
                                key={i}
                                className="h-64 bg-gray-100 border-none"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="lg:col-span-3 space-y-6">
                <Card className="h-96 bg-gray-100 border-none" />
            </div>
        </div>
    );
}
