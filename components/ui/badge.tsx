import React from "react";
import { Sparkles, BadgeCheck } from "lucide-react";
import { cn } from "@/utils/cn";

type BadgeVariant = "ai" | "verified" | "neutral" | "primary" | "outline";

interface BadgeProps {
    variant?: BadgeVariant;
    className?: string;
    label?: string;
    children?: React.ReactNode;
}

export function Badge({
    variant = "neutral",
    className = "",
    label,
    children,
}: BadgeProps) {
    const content = children || label;

    if (variant === "ai") {
        return (
            <div
                className={cn(
                    "bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-lg shadow-primary/20 tracking-wider uppercase",
                    className
                )}
            >
                <Sparkles className="h-3 w-3" />
                {content || "AI Generated"}
            </div>
        );
    }

    if (variant === "verified") {
        return (
            <div
                className={cn(
                    "bg-card/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm border border-border/40 text-primary",
                    className
                )}
            >
                <BadgeCheck className="h-3.5 w-3.5 fill-primary/10" />
                {content || "Verified"}
            </div>
        );
    }

    if (variant === "primary") {
        return (
            <div
                className={cn(
                    "px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold tracking-wider uppercase border border-primary/10",
                    className
                )}
            >
                {content}
            </div>
        );
    }

    if (variant === "outline") {
        return (
            <div
                className={cn(
                    "px-3 py-1 bg-muted/50 text-muted-foreground text-[10px] font-bold tracking-wider uppercase border border-border/50 rounded-full",
                    className
                )}
            >
                {content}
            </div>
        );
    }

    return (
        <div
            className={cn(
                "px-2.5 py-1 w-fit bg-muted/50 rounded-full text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider border border-border/40",
                className
            )}
        >
            {content || "Badge"}
        </div>
    );
}

export default Badge;
