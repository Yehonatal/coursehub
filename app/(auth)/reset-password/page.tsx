"use client";

import { useActionState, useState } from "react";
import { resetPassword, type ActionResponse } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HandDrawnUnderline } from "@/components/ui/decorations";
import Link from "next/link";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

const initialState: ActionResponse = {
    success: false,
    message: "",
};

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [state, action, isPending] = useActionState(
        resetPassword,
        initialState
    );
    const [showPassword, setShowPassword] = useState(false);

    if (!token) {
        return (
            <div className="w-full space-y-8 text-center">
                <h1 className="text-2xl font-serif font-medium text-red-600">
                    Invalid Link
                </h1>
                <p className="text-muted-foreground">
                    This password reset link is invalid or has expired.
                </p>
                <Link
                    href="/forgot-password"
                    className="inline-flex items-center justify-center text-sm font-medium text-foreground hover:underline"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Request a new link
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">
                    Reset{" "}
                    <HandDrawnUnderline className="text-primary">
                        password
                    </HandDrawnUnderline>
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your new password below.
                </p>
            </div>

            {state.success ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                    <p className="text-green-600 dark:text-green-400 font-medium">
                        Password Reset Successful
                    </p>
                    <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-1">
                        Your password has been updated. You can now log in with
                        your new password.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
                    >
                        Log in
                    </Link>
                </div>
            ) : (
                <form action={action} className="space-y-6">
                    <input type="hidden" name="token" value={token} />

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-foreground">
                            New Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                className="h-11 bg-background border-border focus-visible:ring-primary pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                        {state?.errors?.password && (
                            <p className="text-sm text-red-500">
                                {state.errors.password[0]}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="confirmPassword"
                            className="text-foreground"
                        >
                            Confirm Password
                        </Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="h-11 bg-background border-border focus-visible:ring-primary"
                        />
                        {state?.errors?.confirmPassword && (
                            <p className="text-sm text-red-500">
                                {state.errors.confirmPassword[0]}
                            </p>
                        )}
                    </div>

                    {state?.message && !state.success && (
                        <p className="text-sm text-red-500 text-center">
                            {state.message}
                        </p>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                        disabled={isPending}
                    >
                        {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Reset Password
                    </Button>
                </form>
            )}
        </div>
    );
}
