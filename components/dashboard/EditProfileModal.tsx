"use client";

import { useEffect, useState, useActionState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
import type { User } from "@/app/types/user";
import { updateProfile } from "@/app/actions/profile";
import type { ActionResponse } from "@/app/actions/auth";

const initialActionState: ActionResponse = {
    success: false,
    message: "",
};

interface EditProfileModalProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
}

export function EditProfileModal({
    open,
    onClose,
    user,
}: EditProfileModalProps) {
    const router = useRouter();
    const [state, action, isPending] = useActionState(
        updateProfile,
        initialActionState
    );
    const [mounted, setMounted] = useState(false);

    // Local state for inputs to allow editing
    const [firstName, setFirstName] = useState(user?.first_name ?? "");
    const [lastName, setLastName] = useState(user?.last_name ?? "");
    const [university, setUniversity] = useState(user?.university ?? "");
    const [headline, setHeadline] = useState(user?.headline ?? "");

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (open) {
            setFirstName(user?.first_name ?? "");
            setLastName(user?.last_name ?? "");
            setUniversity(user?.university ?? "");
            setHeadline(user?.headline ?? "");
        }
    }, [open, user]);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Profile updated", {
                description: "Your dashboard now reflects the latest info.",
            });
            router.refresh();
            onClose();
        } else if (state.message && !state.success && state.message !== "") {
            toast.error(state.message);
        }
    }, [state, onClose, router]);

    useEffect(() => {
        if (!open) return;
        const handler = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose, open]);

    if (!mounted || !open || !user) {
        return null;
    }

    const modalContent = (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur"
                onClick={onClose}
                aria-hidden="true"
            />
            <Card
                role="dialog"
                aria-modal="true"
                className="relative z-10 w-full max-w-2xl space-y-6 px-6 py-8 dark:bg-slate-900"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Profile
                        </p>
                        <h2 className="text-xl font-semibold text-[#0A251D]">
                            Update your details
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={onClose}
                        aria-label="Close edit profile modal"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form action={action} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Addis"
                            />
                            {state.errors?.firstName && (
                                <p className="text-xs text-destructive">
                                    {state.errors.firstName[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Gebremedhin"
                            />
                            {state.errors?.lastName && (
                                <p className="text-xs text-destructive">
                                    {state.errors.lastName[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="headline">Headline</Label>
                        <Input
                            id="headline"
                            name="headline"
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            placeholder="Software Engineering Student | AI Enthusiast"
                        />
                        {state.errors?.headline && (
                            <p className="text-xs text-destructive">
                                {state.errors.headline[0]}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="university">University</Label>
                        <Input
                            id="university"
                            name="university"
                            value={university}
                            onChange={(e) => setUniversity(e.target.value)}
                            placeholder="Addis Ababa Science and Technology University"
                        />
                        {state.errors?.university && (
                            <p className="text-xs text-destructive">
                                {state.errors.university[0]}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save changes"
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );

    return createPortal(modalContent, document.body);
}
