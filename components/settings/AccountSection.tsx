"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "@/components/dashboard/EditProfileModal";
import { useUser } from "@/components/providers/UserProvider";
import { getUserStorageStats, StorageStats } from "@/app/actions/stats";
import { cn } from "@/utils/cn";

interface AccountSectionProps {
    quota?: {
        storage_usage: number;
        ai_generations_count: number;
        ai_chat_count: number;
    } | null;
}

export default function AccountSection({
    quota: initialQuota,
}: AccountSectionProps) {
    const { user } = useUser();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [storageStats, setStorageStats] = useState<StorageStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const stats = await getUserStorageStats();
                setStorageStats(stats);
            } catch (err) {
                console.error(
                    "Failed to fetch storage stats in AccountSection",
                    err
                );
            }
        };
        fetchStats();
    }, []);

    const storageLimit =
        user?.subscription_status === "pro" ||
        user?.subscription_status === "active"
            ? 10 * 1024 * 1024 * 1024 // 10GB
            : 100 * 1024 * 1024; // 100MB

    const currentUsage =
        storageStats?.totalSizeInBytes || initialQuota?.storage_usage || 0;
    const storageUsageMB = currentUsage / (1024 * 1024);
    const storageLimitDisplay =
        storageLimit >= 1024 * 1024 * 1024 ? "10GB" : "100MB";
    const storageUsageDisplay =
        storageUsageMB >= 1024
            ? `${(storageUsageMB / 1024).toFixed(2)}GB`
            : `${storageUsageMB.toFixed(1)}MB`;

    const storagePercentage = Math.min(
        100,
        (currentUsage / storageLimit) * 100
    );

    const isPremium =
        user?.subscription_status === "pro" ||
        user?.subscription_status === "active";

    return (
        <section id="account" className="scroll-mt-28">
            <div className="mb-8">
                <h2 className="text-2xl font-serif font-semibold text-primary tracking-tight">
                    Account
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                    Manage your profile information and account settings.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-md">
                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-primary/90">
                            Profile Information
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Update your name, email, and profile picture.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditModalOpen(true)}
                        className="rounded-xl border-primary/10 hover:bg-primary/5 text-primary font-medium"
                    >
                        Edit Profile
                    </Button>
                </div>

                <div
                    className={cn(
                        "p-6 rounded-2xl border transition-all hover:shadow-md backdrop-blur-sm",
                        isPremium
                            ? "border-primary/20 bg-primary/5 shadow-sm shadow-primary/5"
                            : "border-border/50 bg-card/50"
                    )}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="space-y-1">
                            <h3 className="text-base font-semibold text-primary/90">
                                Storage Usage
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {storageUsageDisplay} of {storageLimitDisplay}{" "}
                                used
                            </p>
                        </div>
                        {isPremium && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-primary/10 text-primary">
                                Premium Storage
                            </span>
                        )}
                    </div>
                    <div className="h-2 w-full bg-primary/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${storagePercentage}%` }}
                        />
                    </div>
                </div>
            </div>

            <EditProfileModal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
            />
        </section>
    );
}
