import React from "react";
import { FolderOpen, Users, GraduationCap, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    highlight?: boolean;
}

function StatCard({ label, value, icon, highlight }: StatCardProps) {
    return (
        <div
            className={`rounded-[2rem] flex-1 p-8 flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 border ${
                highlight
                    ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/10"
                    : "bg-muted/5 border-border/20 hover:border-primary/20"
            }`}
        >
            {icon && <div className="mb-1">{icon}</div>}
            <div
                className={`text-5xl font-serif font-bold tracking-tighter ${
                    highlight ? "text-white" : "text-primary"
                }`}
            >
                {value}
            </div>
            <div
                className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                    highlight ? "text-white/40" : "text-muted-foreground/40"
                }`}
            >
                {label}
            </div>
        </div>
    );
}

export function UniversityStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 p-0 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8 relative">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold">
                            Community
                        </p>
                        <h3 className="text-xl font-serif font-bold text-primary tracking-tight">
                            University Reach
                        </h3>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 relative">
                    <StatCard label="Active Students" value="250" />
                    <StatCard label="Verified Staff" value="8" />
                </div>
            </div>

            <div className="p-8 bg-primary text-primary-foreground rounded-[2.5rem] shadow-2xl shadow-primary/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
                <div className="relative h-full flex flex-col justify-between">
                    <div className="space-y-1.5">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/40 font-bold">
                            Resources
                        </p>
                        <h3 className="text-xl font-serif font-bold tracking-tight">
                            Shared Knowledge
                        </h3>
                    </div>

                    <div className="mt-8">
                        <div className="flex items-baseline gap-3">
                            <span className="text-6xl font-serif font-bold tracking-tighter">
                                105
                            </span>
                            <span className="text-primary-foreground/60 font-medium">
                                Files
                            </span>
                        </div>
                        <div className="mt-6 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                <FolderOpen className="h-6 w-6 text-white" />
                            </div>
                            <p className="text-xs text-primary-foreground/70 leading-relaxed font-medium">
                                Total resources shared by the community.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
