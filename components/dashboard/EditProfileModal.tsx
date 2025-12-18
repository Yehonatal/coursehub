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
            // Schedule the updates so we don't call setState synchronously inside
            // the effect body which may trigger cascading renders.
            const id = setTimeout(() => {
                setFirstName(user.first_name ?? "");
                setLastName(user.last_name ?? "");
                setUniversity(user.university ?? "");
                setHeadline(user.headline ?? "");
            }, 0);
            return () => clearTimeout(id);
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
        <div className="fixed inset-0 z-1000 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur"
                onClick={onClose}
                aria-hidden="true"
            />
            <Card
                role="dialog"
                aria-modal="true"
                className="relative z-10 w-full max-w-2xl space-y-6 px-8 py-10 bg-white border-border/50 shadow-2xl rounded-[2rem]"
            >
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                            Profile Settings
                        </p>
                        <h2 className="text-2xl font-serif font-semibold text-primary tracking-tight">
                            Update your details
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={onClose}
                        className="rounded-full hover:bg-primary/5 text-muted-foreground/40 hover:text-primary transition-colors"
                        aria-label="Close edit profile modal"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {state.message && (
                    <div
                        className={`p-3 rounded-xl text-sm font-medium ${
                            state.errors && Object.keys(state.errors).length
                                ? "bg-destructive/5 text-destructive border border-destructive/10"
                                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}
                    >
                        {state.message}
                    </div>
                )}

                <form className="space-y-8" action={action}>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2.5">
                            <Label
                                htmlFor="firstName"
                                className="text-sm font-medium text-primary/80 ml-1"
                            >
                                First name
                            </Label>
                            <Input
                                id="firstName"
                                ref={firstInputRef}
                                name="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="e.g. John"
                                className="h-12 rounded-xl border-border/50 bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all"
                                aria-label="First name"
                            />
                            {state.errors?.firstName && (
                                <p className="text-xs text-destructive font-medium ml-1">
                                    {state.errors.firstName[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2.5">
                            <Label
                                htmlFor="lastName"
                                className="text-sm font-medium text-primary/80 ml-1"
                            >
                                Last name
                            </Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="e.g. Doe"
                                className="h-12 rounded-xl border-border/50 bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all"
                            />
                            {state.errors?.lastName && (
                                <p className="text-xs text-destructive font-medium ml-1">
                                    {state.errors.lastName[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between ml-1">
                            <Label
                                htmlFor="headline"
                                className="text-sm font-medium text-primary/80"
                            >
                                Headline
                            </Label>
                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider">
                                {headline.length}/150
                            </span>
                        </div>
                        <Input
                            id="headline"
                            name="headline"
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            placeholder="e.g. Software Engineering Student | AI Enthusiast"
                            className="h-12 rounded-xl border-border/50 bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all"
                        />
                        {state.errors?.headline && (
                            <p className="text-xs text-destructive font-medium ml-1">
                                {state.errors.headline[0]}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2.5">
                        <Label
                            htmlFor="university"
                            className="text-sm font-medium text-primary/80 ml-1"
                        >
                            University
                        </Label>
                        <Input
                            id="university"
                            name="university"
                            value={university}
                            onChange={(e) => setUniversity(e.target.value)}
                            placeholder="e.g. Stanford University"
                            className="h-12 rounded-xl border-border/50 bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all"
                        />
                        {state.errors?.university && (
                            <p className="text-xs text-destructive font-medium ml-1">
                                {state.errors.university[0]}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Button
                            variant="ghost"
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
                            className="rounded-xl px-6 text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="rounded-xl px-8 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/10 transition-all"
                        >
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
