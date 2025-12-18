"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { changePassword, ActionResponse } from "@/app/actions/auth";
import { Loader2, ShieldCheck, KeyRound, Monitor } from "lucide-react";

const initialState: ActionResponse = {
    success: false,
    message: "",
};

export default function SecuritySection() {
    const [state, formAction, isPending] = useActionState(
        changePassword,
        initialState
    );
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast.success(state.message);
                formRef.current?.reset();
            } else {
                toast.error(state.message);
            }
        }
    }, [state]);

    return (
        <section id="security" className="scroll-mt-28">
            <div className="mb-8">
                <h2 className="text-2xl font-serif font-semibold text-primary tracking-tight">
                    Security
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                    Manage your password and account security.
                </p>
            </div>

            <div className="space-y-8">
                {/* Change Password */}
                <div className="p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-md">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-11 w-11 rounded-xl bg-primary/5 flex items-center justify-center text-primary/70">
                            <KeyRound className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-primary/90">
                                Change Password
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Update your password to keep your account
                                secure.
                            </p>
                        </div>
                    </div>

                    <form
                        ref={formRef}
                        action={formAction}
                        className="space-y-4 max-w-md"
                    >
                        <div className="space-y-2">
                            <Label
                                htmlFor="currentPassword"
                                className="text-sm font-medium text-primary/80"
                            >
                                Current Password
                            </Label>
                            <Input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                required
                                className="bg-card/40 border-border/50 focus:border-primary/30 focus:ring-primary/5 rounded-xl h-11"
                            />
                            {state.errors?.currentPassword && (
                                <p className="text-xs text-destructive font-medium">
                                    {state.errors.currentPassword[0]}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="newPassword"
                                className="text-sm font-medium text-primary/80"
                            >
                                New Password
                            </Label>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                required
                                className="bg-card/40 border-border/50 focus:border-primary/30 focus:ring-primary/5 rounded-xl h-11"
                            />
                            {state.errors?.newPassword && (
                                <p className="text-xs text-destructive font-medium">
                                    {state.errors.newPassword[0]}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium text-primary/80"
                            >
                                Confirm New Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="bg-card/40 border-border/50 focus:border-primary/30 focus:ring-primary/5 rounded-xl h-11"
                            />
                            {state.errors?.confirmPassword && (
                                <p className="text-xs text-destructive font-medium">
                                    {state.errors.confirmPassword[0]}
                                </p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full sm:w-auto px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all shadow-sm"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </form>
                </div>

                {/* Active Sessions */}
                <div className="p-6 rounded-xl border bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Monitor className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium">
                                Active Sessions
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Devices currently logged into your account.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-dashed">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                                    <ShieldCheck className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        Current Session
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Linux • Chrome • Addis Ababa, ET
                                    </p>
                                </div>
                            </div>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 uppercase tracking-wider">
                                Active Now
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
