"use client";

import { useEffect, useState, useActionState, useRef } from "react";
import { createPortal } from "react-dom";
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
        // Schedule the state update to the next tick to avoid synchronous
        // setState during the effect which can trigger cascading renders.
        const id = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(id);
    }, []);

    useEffect(() => {
        if (open && user) {
            setFirstName((prev) =>
                prev !== (user.first_name ?? "") ? user.first_name ?? "" : prev
            );
            setLastName((prev) =>
                prev !== (user.last_name ?? "") ? user.last_name ?? "" : prev
            );
            setUniversity((prev) =>
                prev !== (user.university ?? "") ? user.university ?? "" : prev
            );
            setHeadline((prev) =>
                prev !== (user.headline ?? "") ? user.headline ?? "" : prev
            );
        }
    }, [open, user]);

    // Prevent repeated toasts by tracking whether we've already notified for the
    // currently-handled action state. useActionState exposes `state` which may be
    // updated on subsequent renders; guard to avoid duplicate notifications.
    const hasNotifiedRef = useRef(false);
    useEffect(() => {
        if (!open) {
            // Reset the notification guard when modal closes or re-opens.
            hasNotifiedRef.current = false;
        }
    }, [open]);

    useEffect(() => {
        if (state.success && !hasNotifiedRef.current) {
            hasNotifiedRef.current = true;
            toast.success(state.message || "Profile updated", {
                description: "Your dashboard now reflects the latest info.",
            });
            // rely on server-side revalidation instead of a client refresh to
            // avoid double refresh events which could trigger duplicate
            // effects/notifications.
            onClose();
        } else if (
            state.message &&
            !state.success &&
            state.message !== "" &&
            !hasNotifiedRef.current
        ) {
            hasNotifiedRef.current = true;
            toast.error(state.message);
        }
    }, [state, onClose]);

    const firstInputRef = useRef<HTMLInputElement | null>(null);
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

    // Focus the first input when the modal opens and lock background scroll.
    useEffect(() => {
        if (open) {
            firstInputRef.current?.focus();
            // lock background scroll
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = prev || "";
            };
        }
    }, [open]);

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
                className="relative z-10 w-full max-w-2xl space-y-6 px-6 py-8 dark:bg-slate-900 rounded-2xl"
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
                {state.message && (
                    <p
                        className={`text-sm ${
                            state.errors && Object.keys(state.errors).length
                                ? "text-destructive"
                                : "text-emerald-600"
                        }`}
                    >
                        {state.message}
                    </p>
                )}
                <form className="space-y-6" action={action}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input
                                id="firstName"
                                ref={firstInputRef}
                                name="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Addis"
                                aria-label="First name"
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
                        <div
                            className="text-xs text-muted-foreground text-right"
                            aria-live="polite"
                        >
                            {headline.length}/150
                        </div>
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
                            onClick={() => {
                                if (isPending) return;
                                setFirstName(user?.first_name ?? "");
                                setLastName(user?.last_name ?? "");
                                setUniversity(user?.university ?? "");
                                setHeadline(user?.headline ?? "");
                                onClose();
                            }}
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
