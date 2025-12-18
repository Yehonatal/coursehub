import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type ModelCardProps = {
    title: string;
    status: "Active" | "Coming Soon";
    description: string;
    icon: React.ElementType;
    accent: string;
    disabled?: boolean;
};

export function ModelCard({
    title,
    status,
    description,
    icon: Icon,
    accent,
    disabled,
}: ModelCardProps) {
    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-2xl border bg-card/80 p-5 sm:p-6 transition-all",
                disabled
                    ? "border-border/50 opacity-70 grayscale cursor-not-allowed"
                    : "border-border hover:shadow-xl hover:border-primary/25 cursor-pointer"
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br opacity-40" />
            <div
                className={cn(
                    "absolute -inset-1 bg-gradient-to-br",
                    accent,
                    disabled ? "opacity-10" : "opacity-20",
                    "blur-2xl"
                )}
                aria-hidden
            />
            <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 sm:gap-5">
                    <div className="rounded-xl bg-card/70 p-3.5 shadow-sm text-primary">
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg sm:text-xl tracking-tight text-foreground">
                                {title}
                            </h3>
                            <span
                                className={cn(
                                    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border",
                                    status === "Active"
                                        ? "bg-primary/10 border-primary/30 text-primary"
                                        : "bg-secondary border-border text-muted-foreground"
                                )}
                            >
                                {status}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>
                {!disabled && (
                    <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-primary"
                        >
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
