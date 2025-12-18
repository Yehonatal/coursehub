"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "@/components/dashboard/EditProfileModal";
import { useUser } from "@/components/providers/UserProvider";

export default function AccountSection() {
    const { user } = useUser();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
                <div className="flex items-center justify-between p-6 rounded-2xl border border-border/50 bg-white/50 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
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
            </div>

            <EditProfileModal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
            />
        </section>
    );
}
