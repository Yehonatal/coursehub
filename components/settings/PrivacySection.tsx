"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { useUser } from "@/components/providers/UserProvider";

export default function PrivacySection() {
    const { user } = useUser();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const userFullName = user ? `${user.first_name} ${user.last_name}` : "";

    return (
        <section id="privacy" className="scroll-mt-28">
            <div className="mb-8">
                <h2 className="text-2xl font-serif font-semibold text-primary tracking-tight">
                    Privacy
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                    Control your data and how your information is shared.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-6 rounded-2xl border border-border/50 bg-white/50 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-primary/90">
                            Data Management
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Export your data or request account deletion.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl text-primary/70 hover:bg-primary/5 hover:text-primary font-medium"
                        >
                            Export Data
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl text-destructive/70 hover:text-destructive hover:bg-destructive/5 font-medium"
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
            </div>

            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                userFullName={userFullName}
            />
        </section>
    );
}
