import React from "react";
import { Sparkles, BadgeCheck } from "lucide-react";
import { cn } from "@/utils/cn";

type BadgeVariant =
    | "ai"
    | "verified"
    | "neutral"
    | "primary"
    | "outline"
    | "secondary"
    | "destructive";

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

    const base =
        "rounded-xl w-fit inline-flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 transition-all duration-200";

    const variants = {
        ai: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 px-3",
        verified:
            "bg-primary/95 text-primary-foreground shadow-lg border border-primary/20",
        primary:
            "bg-primary/10 text-primary border border-primary/20 shadow-none",
        secondary:
            "bg-secondary text-secondary-foreground border border-border/50 shadow-none",
        neutral:
            "bg-muted/80 backdrop-blur-sm text-muted-foreground border border-border/40 shadow-none",
        outline:
            "bg-transparent border border-border text-foreground shadow-none",
        destructive:
            "bg-destructive/10 text-destructive border border-destructive/20 shadow-none",
    };

    return (
        <div className={cn(base, variants[variant], className)}>
            {variant === "ai" && <Sparkles className="h-3 w-3" aria-hidden />}
            {variant === "verified" && (
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
            )}
            {content ||
                (variant === "ai"
                    ? "AI Generated"
                    : variant === "verified"
                    ? "Verified"
                    : "Badge")}
        </div>
    );
}

export default Badge;
