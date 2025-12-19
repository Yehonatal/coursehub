"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Upload, Info, Crown } from "lucide-react";
import { AIUploadModal } from "./AIUploadModal";
import { getUserStorageStats, StorageStats } from "@/app/actions/stats";
import { cn } from "@/utils/cn";

export function AIUploadCard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stats, setStats] = useState<StorageStats | null>(null);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getUserStorageStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch storage stats", err);
            }
        };
        fetchStats();
    }, []);

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    return (
        <>
            <Card
                className="p-8 space-y-8 border border-border rounded-3xl sticky top-24 shadow-2xl shadow-primary/5 bg-card group/card"
                data-aos="fade-left"
                data-aos-delay="400"
                suppressHydrationWarning
            >
                <div className="space-y-6 relative">
                    {/* Info Hover Modal */}
                    <div
                        className={cn(
                            "absolute -top-4 -right-4 z-50 w-72 p-5 bg-card border border-border rounded-3xl shadow-2xl transition-all duration-500 pointer-events-none",
                            showInfo
                                ? "opacity-100 translate-y-0 scale-100"
                                : "opacity-0 translate-y-4 scale-95"
                        )}
                    >
                        <div className="flex items-center gap-3 mb-3 text-primary">
                            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Info className="h-4 w-4" />
                            </div>
                            <h4 className="text-xs font-bold uppercase tracking-widest">
                                Storage Details
                            </h4>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Your current plan (Free) includes{" "}
                                <span className="font-bold text-foreground">
                                    100MB
                                </span>{" "}
                                of cloud storage for all your resources and AI
                                generated content.
                            </p>
                            <div className="p-3 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3 group/premium cursor-pointer pointer-events-auto">
                                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                                    <Crown className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-tight">
                                        Upgrade to Premium
                                    </p>
                                    <p className="text-[9px] text-primary/60 font-medium">
                                        Get 10GB + Priority AI
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Folder className="h-6 w-6 fill-primary/20 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-serif font-semibold text-lg text-foreground tracking-tight">
                                    AI Generated Content
                                </h3>
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                    <span>
                                        {stats
                                            ? formatSize(stats.totalSizeInBytes)
                                            : "..."}
                                    </span>
                                    <span className="h-1 w-1 rounded-full bg-muted-foreground/20" />
                                    <span>
                                        {stats
                                            ? `${stats.totalItems} Items`
                                            : "..."}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onMouseEnter={() => setShowInfo(true)}
                            onMouseLeave={() => setShowInfo(false)}
                            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground/40 hover:text-primary hover:bg-primary/5 transition-all"
                        >
                            <Info className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Tree
                        </span>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Questions
                        </span>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Note
                        </span>
                    </div>

                    <div
                        className="aspect-square rounded-2xl bg-muted/30 border border-dashed border-border flex flex-col items-center justify-center text-center p-6 gap-5 hover:bg-muted/50 hover:border-primary/30 transition-all duration-300 cursor-pointer group"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <div className="h-14 w-14 rounded-2xl bg-card shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-500">
                            <Upload className="h-6 w-6 text-primary/40 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-sm font-semibold text-foreground">
                                Drag and drop or{" "}
                                <span className="text-primary underline decoration-primary/20 group-hover:decoration-primary transition-all">
                                    Browse
                                </span>
                            </p>
                            <p className="text-xs text-muted-foreground/60 font-medium">
                                Max file size 10MB
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                Storage Usage
                            </h4>
                            <span className="text-[10px] font-bold text-primary">
                                {stats ? `${stats.usagePercentage}%` : "..."}
                            </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                style={{
                                    width: stats
                                        ? `${stats.usagePercentage}%`
                                        : "0%",
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </Card>
            <AIUploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
