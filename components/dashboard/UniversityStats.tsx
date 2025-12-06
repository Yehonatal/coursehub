import React from "react";
import { FolderOpen, Users, GraduationCap } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    highlight?: boolean;
}

function StatCard({ label, value, icon, highlight }: StatCardProps) {
    return (
        <div
            className={`rounded-xl flex-1 p-6 flex flex-col items-center justify-center text-center gap-2 ${
                highlight ? "bg-[#FDF6B2]" : "bg-blue-50/50"
            }`}
        >
            {icon && <div className="mb-1">{icon}</div>}
            <div className="text-4xl font-bold text-[#0A251D]">{value}</div>
            <div className="text-sm font-medium text-muted-foreground">
                {label}
            </div>
        </div>
    );
}

export function UniversityStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_1.5fr] gap-4">
            <div className="space-y-4 flex flex-wrap gap-4">
                <StatCard label="Students" value="250" />
                <StatCard label="Staff" value="8" />
            </div>
            <div className="h-full">
                <div className="h-full rounded-xl bg-[#FDF6B2] p-6 flex flex-col items-center justify-center text-center gap-2">
                    <div className="flex items-center gap-2 text-[#0A251D] mb-2">
                        <FolderOpen className="h-8 w-8 text-blue-500 fill-blue-500" />
                        <span className="text-5xl font-bold">105</span>
                    </div>
                    <p className="text-sm font-medium text-[#0A251D]/80 max-w-[150px]">
                        Files Uploaded by Student and Staff
                    </p>
                </div>
            </div>
        </div>
    );
}
