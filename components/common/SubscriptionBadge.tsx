"use client";

import React from "react";
import { Crown, Info, Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";

interface SubscriptionBadgeProps {
    status?: string | null;
    className?: string;
    showDetails?: boolean;
}

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

export function SubscriptionBadge({
    status = "free",
    className,
    showDetails = true,
}: SubscriptionBadgeProps) {
    const isPremium = status === "pro" || status === "active";
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ left: 0, top: 0 });

    useEffect(() => {
        if (!open || !wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        setCoords({ left: rect.left + rect.width / 2, top: rect.top });

        function handleScroll() {
            const rect = wrapperRef.current?.getBoundingClientRect();
            if (rect)
                setCoords({ left: rect.left + rect.width / 2, top: rect.top });
        }

        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleScroll);
        };
    }, [open]);

    const popover = (
        <div
            style={{
                left: coords.left,
                top: coords.top,
                transform: "translate(-50%, calc(-100% - 8px))",
            }}
            className="fixed z-50 w-64 p-4 bg-card border border-border rounded-2xl shadow-2xl"
        >
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div
                        className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center",
                            isPremium
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                        )}
                    >
                        {isPremium ? (
                            <Crown className="h-4 w-4" />
                        ) : (
                            <Sparkles className="h-4 w-4" />
                        )}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-foreground">
                            {isPremium ? "Premium Plan" : "Free Plan"}
                        </h4>
                        <p className="text-[10px] text-muted-foreground">
                            {isPremium
                                ? "Full access unlocked"
                                : "Limited access"}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">
                            AI Generations
                        </span>
                        <span className="font-bold text-foreground">
                            {isPremium ? "Unlimited" : "5 / day"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">AI Chat</span>
                        <span className="font-bold text-foreground">
                            {isPremium ? "Unlimited" : "10 / day"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Storage</span>
                        <span className="font-bold text-foreground">
                            {isPremium ? "Unlimited" : "100 MB"}
                        </span>
                    </div>
                </div>

                {!isPremium && (
                    <div className="pt-2 border-t border-border">
                        <p className="text-[10px] text-primary font-medium">
                            Upgrade in settings to unlock all features.
                        </p>
                    </div>
                )}
            </div>
            <div
                style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    top: "100%",
                }}
                className="border-8 border-transparent border-t-card"
            />
        </div>
    );

    return (
        <div
            ref={wrapperRef}
            className={cn("inline-block ", className)}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <div
                className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300",
                    isPremium
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "bg-muted text-muted-foreground border border-border"
                )}
            >
                {isPremium ? (
                    <>
                        <Crown className="h-3 w-3 fill-current" />
                        <span>Premium</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="h-3 w-3" />
                        <span>Free Tier</span>
                    </>
                )}

                {showDetails && (
                    <div className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity">
                        <Info className="h-2.5 w-2.5" />
                    </div>
                )}
            </div>

            {showDetails &&
                open &&
                typeof document !== "undefined" &&
                createPortal(popover, document.body)}
        </div>
    );
}
