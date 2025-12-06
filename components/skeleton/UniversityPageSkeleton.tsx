import React from "react";
import { Card } from "@/components/ui/card";

export function UniversityPageSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 animate-pulse">
            <div className="space-y-8">
                <div className="space-y-6">
                    <div className="h-32 sm:h-48 w-full rounded-t-xl bg-gray-200"></div>
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="h-24 w-24 rounded-full bg-gray-200 -mt-12 border-4 border-white shrink-0"></div>
                        <div className="space-y-2 flex-1 pt-2">
                            <div className="h-8 w-64 bg-gray-200 rounded"></div>
                            <div className="h-4 w-full max-w-2xl bg-gray-200 rounded"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-8">
                    <div className="space-y-4">
                        <div className="h-4 w-48 bg-gray-200 rounded"></div>
                        <div className="grid grid-cols-2 md:grid-cols-[1fr_1.5fr] gap-4">
                            <div className="space-y-4">
                                <div className="h-24 bg-gray-200 rounded-xl"></div>
                                <div className="h-24 bg-gray-200 rounded-xl"></div>
                            </div>
                            <div className="h-full bg-gray-200 rounded-xl min-h-[200px]"></div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="h-4 w-48 bg-gray-200 rounded"></div>
                        <div className="space-y-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                        <div className="h-3 w-48 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="h-8 w-48 bg-gray-200 rounded"></div>
                        <div className="flex gap-2">
                            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Card
                                key={i}
                                className="h-48 bg-gray-100 border-none"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
