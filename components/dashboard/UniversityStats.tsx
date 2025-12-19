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
            className={`rounded-3xl flex-1 p-8 flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 border ${
                highlight
                    ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/10"
                    : "bg-card border-border hover:border-primary/20"
            }`}
        >
            {icon && <div className="mb-1">{icon}</div>}
            <div
                className={`text-5xl font-serif font-bold tracking-tighter ${
                    highlight ? "text-primary-foreground" : "text-foreground"
                }`}
            >
                {value}
            </div>
            <div
                className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                    highlight
                        ? "text-primary-foreground/40"
                        : "text-muted-foreground/60"
                }`}
            >
                {label}
            </div>
        </div>
    );
}

interface UniversityStatsProps {
    students: number;
    resources: number;
    verified: number;
}

export function UniversityStats({
    students,
    resources,
    verified,
}: UniversityStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 p-0 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8 relative">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                            Community
                        </p>
                        <h3 className="text-xl font-serif font-bold text-primary tracking-tight">
                            University Reach
                        </h3>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 relative">
                    <StatCard label="Active Students" value={students} />
                    <StatCard label="Verified Materials" value={verified} />
                </div>
            </div>

            <div className="p-8 bg-card text-card-foreground rounded-3xl shadow-lg border border-border relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent)] opacity-[0.03]" />
                <div className="relative h-full flex flex-col justify-between">
                    <div className="space-y-1.5">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                            Resources
                        </p>
                        <h3 className="text-xl font-serif font-bold tracking-tight text-primary">
                            Shared Knowledge
                        </h3>
                    </div>

                    <div className="mt-8">
                        <div className="flex items-baseline gap-3">
                            <span className="text-6xl font-serif font-bold tracking-tighter text-foreground">
                                {resources}
                            </span>
                            <span className="text-muted-foreground/60 font-medium">
                                Files
                            </span>
                        </div>
                        <div className="mt-6 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10">
                                <FolderOpen className="h-6 w-6 text-primary" />
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                Total resources shared by the community.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
