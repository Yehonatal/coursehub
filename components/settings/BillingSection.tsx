"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UpgradePlanModal } from "./UpgradePlanModal";
import { ManagePaymentsModal } from "./ManagePaymentsModal";

export default function BillingSection() {
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);

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
                <div className="flex items-center justify-between p-6 rounded-2xl border border-border/50 bg-white/50 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-primary/90">
                            Current Plan
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            You are currently on the{" "}
                            <span className="font-bold text-primary">
                                Free Plan
                            </span>
                            .
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsUpgradeModalOpen(true)}
                        className="rounded-xl border-primary/10 hover:bg-primary/5 text-primary font-medium"
                    >
                        Upgrade Plan
                    </Button>
                </div>

                <div className="flex items-center justify-between p-6 rounded-2xl border border-border/50 bg-white/50 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
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
