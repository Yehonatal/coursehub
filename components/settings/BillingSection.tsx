"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UpgradePlanModal } from "./UpgradePlanModal";
import { ManagePaymentsModal } from "./ManagePaymentsModal";
import { SubscriptionBadge } from "@/components/common/SubscriptionBadge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, MessageSquare, HardDrive } from "lucide-react";
import { getUserStorageStats, StorageStats } from "@/app/actions/stats";
import { getUserQuota } from "@/app/actions/subscription";
import { cn } from "@/utils/cn";
import { useUser } from "@/components/providers/UserProvider";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface BillingSectionProps {
    subscriptionStatus?: string;
    subscriptionExpiry?: Date | null;
    quota?: {
        ai_generations_count: number;
        ai_chat_count: number;
        storage_usage: number;
    } | null;
}

export default function BillingSection({
    subscriptionStatus: initialStatus,
    subscriptionExpiry: initialExpiry,
    quota: initialQuota,
}: BillingSectionProps) {
    const { user } = useUser();
    const searchParams = useSearchParams();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
    const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
    const [quota, setQuota] = useState(initialQuota);

    const currentStatus = user?.subscription_status || initialStatus || "free";
    const currentExpiry = user?.subscription_expiry || initialExpiry;

    useEffect(() => {
        const paymentStatus = searchParams.get("payment");
        if (paymentStatus === "success") {
            toast.success("Payment successful!", {
                description: "Your account has been upgraded to Premium.",
            });
        } else if (paymentStatus === "failed") {
            toast.error("Payment failed", {
                description: "Please try again or contact support.",
            });
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stats, quotaData] = await Promise.all([
                    getUserStorageStats(),
                    getUserQuota(),
                ]);
                setStorageStats(stats);
                if (quotaData) setQuota(quotaData);
            } catch (err) {
                console.error("Failed to fetch data in BillingSection", err);
            }
        };
        fetchData();
    }, []);

    const isPremium = currentStatus === "pro" || currentStatus === "active";

    // Limits based on plan
    const limits = {
        generations: isPremium ? Infinity : 5,
        chats: isPremium ? Infinity : 10,
        storage: isPremium
            ? 10 * 1024 * 1024 * 1024 // 10GB
            : 100 * 1024 * 1024, // 100MB
    };

    const currentStorageUsage =
        storageStats?.totalSizeInBytes || quota?.storage_usage || 0;
    const storageUsageMB = currentStorageUsage / (1024 * 1024);
    const storageLimitDisplay = isPremium ? "10 GB" : "100 MB";
    const storageUsageDisplay =
        storageUsageMB >= 1024
            ? `${(storageUsageMB / 1024).toFixed(2)} GB`
            : `${storageUsageMB.toFixed(1)} MB`;

    const storagePercentage = Math.min(
        (currentStorageUsage / limits.storage) * 100,
        100
    );

    const generationPercentage = isPremium
        ? 0 // Don't show progress for unlimited
        : Math.min(
              ((quota?.ai_generations_count || 0) / limits.generations) * 100,
              100
          );

    const chatPercentage = isPremium
        ? 0 // Don't show progress for unlimited
        : Math.min(((quota?.ai_chat_count || 0) / limits.chats) * 100, 100);

    return (
        <section id="billing" className="scroll-mt-28">
            <div className="mb-8">
                <h2 className="text-2xl font-serif font-semibold text-primary tracking-tight">
                    Billing & Subscription
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                    Manage your plan, payment methods, and billing history.
                </p>
            </div>

            <div className="space-y-4">
                <div
                    className={cn(
                        "p-6 rounded-2xl border transition-all hover:shadow-md backdrop-blur-sm",
                        isPremium
                            ? "border-primary/20 bg-primary/5 shadow-sm shadow-primary/5"
                            : "border-border/50 bg-card/50"
                    )}
                >
                    <div className="flex items-start justify-between">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold text-primary/90">
                                    Current Plan
                                </h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <SubscriptionBadge status={currentStatus} />
                                    {isPremium && currentExpiry && (
                                        <span className="text-xs text-muted-foreground">
                                            Renews on{" "}
                                            {new Date(
                                                currentExpiry
                                            ).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-2">
                                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                    <div
                                        className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            isPremium
                                                ? "bg-primary"
                                                : "bg-primary/40"
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            isPremium &&
                                                "text-primary/80 font-medium"
                                        )}
                                    >
                                        {isPremium
                                            ? "Unlimited AI Generations"
                                            : "5 AI Generations / day"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                    <div
                                        className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            isPremium
                                                ? "bg-primary"
                                                : "bg-primary/40"
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            isPremium &&
                                                "text-primary/80 font-medium"
                                        )}
                                    >
                                        {isPremium
                                            ? "Unlimited AI Chats"
                                            : "10 AI Chats / day"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                    <div
                                        className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            isPremium
                                                ? "bg-primary"
                                                : "bg-primary/40"
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            isPremium &&
                                                "text-primary/80 font-medium"
                                        )}
                                    >
                                        {isPremium
                                            ? "10GB Cloud Storage"
                                            : "100MB Cloud Storage"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                    <div
                                        className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            isPremium
                                                ? "bg-primary"
                                                : "bg-primary/40"
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            isPremium &&
                                                "text-primary/80 font-medium"
                                        )}
                                    >
                                        {isPremium
                                            ? "Priority Support"
                                            : "Standard Support"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {!isPremium ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsUpgradeModalOpen(true)}
                                className="rounded-xl border-primary/10 hover:bg-primary/5 text-primary font-medium"
                            >
                                Upgrade Plan
                            </Button>
                        ) : (
                            <div className="flex flex-col items-end gap-2">
                                <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-md">
                                    Active
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-xl text-muted-foreground hover:bg-primary/5 hover:text-primary font-medium"
                                >
                                    Manage Plan
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-md">
                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-primary/90">
                            Payment Methods
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Manage your credit cards and other payment options.
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsPaymentsModalOpen(true)}
                        className="rounded-xl text-primary/70 hover:bg-primary/5 hover:text-primary font-medium"
                    >
                        Manage Payments
                    </Button>
                </div>

                <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-md">
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                            <h3 className="text-base font-semibold text-primary/90">
                                Usage & Quotas
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {isPremium
                                    ? "You have unlimited AI access and increased storage."
                                    : "Your daily AI usage and storage limits."}
                            </p>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-primary/10 text-primary">
                            Daily Reset
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Sparkles className="w-4 h-4 text-primary/60" />
                                    <span>AI Generations</span>
                                </div>
                                <span className="font-medium text-primary/80">
                                    {quota?.ai_generations_count || 0} /{" "}
                                    {isPremium ? "∞" : limits.generations}
                                </span>
                            </div>
                            <Progress
                                value={generationPercentage}
                                className="h-1.5 bg-primary/5"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MessageSquare className="w-4 h-4 text-primary/60" />
                                    <span>AI Chats</span>
                                </div>
                                <span className="font-medium text-primary/80">
                                    {quota?.ai_chat_count || 0} /{" "}
                                    {isPremium ? "∞" : limits.chats}
                                </span>
                            </div>
                            <Progress
                                value={chatPercentage}
                                className="h-1.5 bg-primary/5"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <HardDrive className="w-4 h-4 text-primary/60" />
                                    <span>Storage</span>
                                </div>
                                <span className="font-medium text-primary/80">
                                    {storageUsageDisplay} /{" "}
                                    {storageLimitDisplay}
                                </span>
                            </div>
                            <Progress
                                value={storagePercentage}
                                className="h-1.5 bg-primary/5"
                            />
                        </div>
                    </div>

                    {!isPremium && (
                        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-primary uppercase tracking-wider">
                                    Premium Tip
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Upgrade to Premium for unlimited AI
                                    generations & & chats, 10GB cloud storage,
                                    and advanced study tools.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <UpgradePlanModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
            />
            <ManagePaymentsModal
                isOpen={isPaymentsModalOpen}
                onClose={() => setIsPaymentsModalOpen(false)}
            />
        </section>
    );
}
