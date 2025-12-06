"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
    FileText,
    Network,
    HelpCircle,
    Folder,
    TrendingUp,
} from "lucide-react";

const CountUp = ({
    end,
    duration = 2000,
}: {
    end: number;
    duration?: number;
}) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };
        requestAnimationFrame(animate);
    }, [end, duration]);

    return <>{count}</>;
};

export function ProfileStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="md:col-span-2 p-5 bg-gradient-to-br from-blue-50/50 to-white border-border/60  relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#0A251D]">
                        Current Repo Status
                    </h3>
                    <div className="px-2 py-1 rounded-full bg-blue-100/50 text-[10px] font-medium text-blue-700 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Top 5%
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-blue-100/50 hover:border-blue-200 transition-colors group">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-[#0A251D] block leading-none">
                                <CountUp end={15} />
                            </span>
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                                Notes
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-teal-100/50 hover:border-teal-200 transition-colors group">
                        <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Network className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-[#0A251D] block leading-none">
                                <CountUp end={6} />
                            </span>
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                                Trees
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-indigo-100/50 hover:border-indigo-200 transition-colors group">
                        <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <HelpCircle className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-[#0A251D] block leading-none">
                                <CountUp end={21} />
                            </span>
                            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                                Questions
                            </span>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="p-5 bg-[#FDF8C5] border-none  relative overflow-hidden flex items-center justify-between">
                <div className="relative z-10">
                    <h3 className="text-xs font-bold text-[#0A251D]/60 uppercase tracking-wider mb-1">
                        Files Uploaded
                    </h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-serif font-bold text-[#0A251D]">
                            <CountUp end={7} />
                        </span>
                        <span className="text-xs font-medium text-[#0A251D]/60">
                            total
                        </span>
                    </div>
                </div>

                <div className="h-14 w-14 rounded-2xl bg-[#0A251D]/5 flex items-center justify-center rotate-3 transition-transform hover:rotate-6">
                    <Folder className="h-7 w-7 text-[#0A251D]" />
                </div>

                {/* Decorative circle */}
                <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-[#0A251D]/5 pointer-events-none"></div>
            </Card>
        </div>
    );
}
