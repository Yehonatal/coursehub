import React from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/utils/cn";

interface PremiumLockProps {
    children: React.ReactNode;
    isPremium: boolean;
    title?: string;
    description?: string;
    className?: string;
    containerClassName?: string;
}

export function PremiumLock({
    children,
    isPremium,
    title = "Premium Feature",
    description = "Upgrade to Pro to unlock this feature and enhance your learning experience.",
    className,
    containerClassName,
}: PremiumLockProps) {
    if (isPremium) return <>{children}</>;

    return (
        <div
            className={cn(
                "relative group/lock overflow-hidden",
                containerClassName
            )}
        >
            <div
                className={cn(
                    "blur-[6px] pointer-events-none select-none opacity-30 transition-all duration-500 group-hover/lock:blur-md",
                    className
                )}
            >
                {children}
            </div>
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-background/20 backdrop-blur-[2px] rounded-3xl border border-primary/10 shadow-2xl shadow-primary/5">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 ring-8 ring-primary/5 animate-in zoom-in duration-500">
                    <Lock className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-serif font-bold text-foreground text-xl mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
                    {title}
                </h4>
                <p className="text-sm text-muted-foreground mb-8 max-w-[280px] leading-relaxed animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300">
                    {description}
                </p>
                <Link
                    href="/settings"
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500"
                >
                    <Button
                        size="lg"
                        className="rounded-full font-bold px-8 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                    >
                        Upgrade to Pro
                    </Button>
                </Link>
            </div>
        </div>
    );
}
