import React from "react";

export function UniversityPageSkeleton() {
    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 animate-pulse">
            <div className="space-y-12">
                {/* Header Section */}
                <div className="space-y-6">
                    <div className="h-32 sm:h-48 w-full rounded-[2rem] bg-muted"></div>
                    <div className="flex flex-col md:flex-row items-start gap-6 px-4">
                        <div className="h-20 w-20 md:h-32 md:w-32 rounded-[2rem] bg-muted -mt-10 md:-mt-14 border-4 border-background shrink-0"></div>
                        <div className="space-y-3 flex-1 pt-2 md:pt-16">
                            <div className="h-8 w-64 bg-muted rounded-xl"></div>
                            <div className="h-4 w-full max-w-2xl bg-muted rounded-lg"></div>
                            <div className="flex gap-4">
                                <div className="h-4 w-32 bg-muted rounded-lg"></div>
                                <div className="h-4 w-32 bg-muted rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats & Community Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Stats Section */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="h-6 w-48 bg-muted rounded-lg"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-32 bg-muted rounded-[2rem]"></div>
                            <div className="h-32 bg-muted rounded-[2rem]"></div>
                        </div>
                        <div className="h-48 bg-muted rounded-[2rem]"></div>
                    </div>

                    {/* Community Section */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="h-6 w-48 bg-muted rounded-lg"></div>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3"
                                >
                                    <div className="h-10 w-10 rounded-full bg-muted"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-32 bg-muted rounded-lg"></div>
                                        <div className="h-3 w-24 bg-muted rounded-lg"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Resources Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="h-8 w-48 bg-muted rounded-xl"></div>
                        <div className="flex gap-2">
                            <div className="h-10 w-10 rounded-full bg-muted"></div>
                            <div className="h-10 w-10 rounded-full bg-muted"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-72 bg-muted rounded-[2rem]"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
