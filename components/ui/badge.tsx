import React from "react";
import { Sparkles, BadgeCheck } from "lucide-react";

type BadgeVariant = "ai" | "verified" | "neutral";

interface BadgeProps {
    variant?: BadgeVariant;
    className?: string;
    label?: string;
}

export function Badge({
    variant = "neutral",
    className = "",
    label,
}: BadgeProps) {
    if (variant === "ai") {
        return (
            <div
                className={`bg-green-600/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1 shadow-sm ${className}`}
            >
                <Sparkles className="h-3 w-3" />
                {label ?? "AI Generated"}
            </div>
        );
    }

    if (variant === "verified") {
        return (
            <div
                className={`bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider flex items-center gap-1 shadow-sm ${className}`}
            >
                <BadgeCheck className="h-3 w-3 text-blue-500" />
                {label ?? "Verified"}
            </div>
        );
    }

    return (
        <div
            className={`px-2 py-0.5 bg-gray-100 rounded text-[10px] font-medium text-gray-700 ${className}`}
        >
            {label ?? "Badge"}
        </div>
    );
}

export default Badge;
