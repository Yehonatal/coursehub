import React from "react";

export function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-[9.5fr_2.5fr] gap-8">
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-24 bg-muted rounded-3xl"
                            ></div>
                        ))}
                    </div>

                    <div className="space-y-4 ">
                        <div className="h-6 w-32 bg-muted rounded-xl"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className="h-64 bg-muted rounded-3xl"
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block space-y-6">
                    <div className="h-[300px] bg-muted rounded-3xl"></div>
                    <div className="h-[150px] bg-muted rounded-3xl"></div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-7 w-40 bg-muted rounded-xl"></div>
                <div className="h-3 w-64 bg-muted/60 rounded-xl"></div>
            </div>
        </div>
    );
}
