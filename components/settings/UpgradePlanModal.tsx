"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { buyPremium } from "@/app/actions/subscription";
import confetti from "canvas-confetti";

interface UpgradePlanModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UpgradePlanModal({ isOpen, onClose }: UpgradePlanModalProps) {
    const [isUpgrading, setIsUpgrading] = useState(false);

    const handleUpgrade = async () => {
        setIsUpgrading(true);
        try {
            // Set to false to use real Chapa payment
            const res = await buyPremium(window.location.origin, false);

            if (res.success) {
                if (res.isDemo) {
                    toast.success("Demo Upgrade Successful!", {
                        description: "Welcome to CourseHub Premium!",
                    });

                    // Celebration!
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ["#FFD700", "#FFA500", "#FF4500"],
                    });

                    setTimeout(() => {
                        onClose();
                        window.location.reload(); // Refresh to show new status
                    }, 2000);
                } else if (res.checkout_url) {
                    toast.success("Redirecting to payment...");
                    window.location.href = res.checkout_url;
                }
            } else {
                toast.error(res.message || "Failed to initialize payment");
            }
        } catch (err) {
            console.error("Upgrade error:", err);
            toast.error("An error occurred during upgrade");
        } finally {
            setIsUpgrading(false);
        }
    };

    const features = [
        "Unlimited AI Generations & Chats",
        "10GB Cloud Storage",
        "Advanced Analytics Dashboard",
        "Priority AI Processing",
        "Advanced Knowledge Trees",
        "Priority Support",
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <div className="p-8 space-y-6">
                    <DialogHeader className="space-y-3">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                <Sparkles className="h-5 w-5 fill-primary/20" />
                            </div>
                            <DialogTitle className="text-2xl font-serif font-semibold tracking-tight">
                                Upgrade to Premium
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                            Unlock the full potential of Course Hub with our
                            Premium plan and excel in your studies.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-2">
                        <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10 mb-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <div className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                                    Best Value
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-5xl font-serif font-bold text-primary">
                                    ETB 1498.5
                                </span>
                                <span className="text-muted-foreground font-medium">
                                    /month
                                </span>
                            </div>
                            <p className="text-sm text-primary/70 font-medium mb-8">
                                Everything you need to excel in your studies.
                            </p>
                            <ul className="space-y-4">
                                {features.map((feature, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-3 text-sm text-primary/80 font-medium"
                                    >
                                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Check className="h-3 w-3 text-primary" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            disabled={isUpgrading}
                            className="flex-1 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium"
                        >
                            Maybe Later
                        </Button>
                        <Button
                            className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/10 transition-all"
                            onClick={handleUpgrade}
                            disabled={isUpgrading}
                        >
                            {isUpgrading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Upgrade Now"
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
