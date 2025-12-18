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

export function ProfileStats({
    stats,
}: {
    stats: {
        notes: number;
        trees: number;
        flashcards: number;
        uploads: number;
        totalResources?: number;
    };
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="md:col-span-2 p-0 bg-transparent relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8 relative">
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                            Overview
                        </p>
                        <h3 className="text-2xl font-serif font-semibold text-primary tracking-tight">
                            Academic Repository
                        </h3>
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-primary/5 text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-wider border border-primary/10">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Top 5% Contributor
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 relative">
                    <div className="flex items-center gap-4 p-5 rounded-2xl border border-border/40 hover:border-primary/20 transition-all group/stat shadow-sm">
                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 transition-transform">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <span className="text-3xl font-serif font-semibold text-primary block leading-none">
                                <CountUp end={stats.notes} />
                            </span>
                            <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                                Notes
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 rounded-2xl border border-border/40 hover:border-primary/20 transition-all group/stat shadow-sm">
                        <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 transition-transform">
                            <Network className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                            <span className="text-3xl font-serif font-semibold text-primary block leading-none">
                                <CountUp end={stats.trees} />
                            </span>
                            <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                                Trees
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-5 rounded-2xl border border-border/40 hover:border-primary/20 transition-all group/stat shadow-sm">
                        <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 transition-transform">
                            <HelpCircle className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <span className="text-3xl font-serif font-semibold text-primary block leading-none">
                                <CountUp end={stats.flashcards} />
                            </span>
                            <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                                Questions
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Card className="p-8 bg-primary text-primary-foreground rounded-[2rem] shadow-lg shadow-primary/20 relative overflow-hidden group border-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
                <div className="relative h-full flex flex-col justify-between">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/60 font-bold">
                            Contributions
                        </p>
                        <h3 className="text-xl font-serif font-semibold tracking-tight">
                            Total Uploads
                        </h3>
                    </div>

                    <div className="mt-8">
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-serif font-semibold tracking-tighter">
                                <CountUp end={stats.uploads} />
                            </span>
                            <span className="text-primary-foreground/60 font-medium">
                                Resources
                            </span>
                        </div>
                        <div className="mt-6 flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                                <Folder className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-xs text-primary-foreground/80 leading-relaxed font-medium">
                                You've shared {stats.uploads} resources with the
                                community. Keep it up!
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
