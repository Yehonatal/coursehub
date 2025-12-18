"use client";

import { useActionState } from "react";
import { forgotPassword, type ActionResponse } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HandDrawnUnderline } from "@/components/ui/decorations";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";

const initialState: ActionResponse = {
    success: false,
    message: "",
};

export default function ForgotPasswordPage() {
    const [state, action, isPending] = useActionState(
        forgotPassword,
        initialState
    );

    return (
        <div className="w-full space-y-8">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">
                    Forgot{" "}
                    <HandDrawnUnderline className="text-primary">
                        password?
                    </HandDrawnUnderline>
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email address and we'll send you a link to reset
                    your password.
                </p>
            </div>

            {state.success ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                    <p className="text-green-600 dark:text-green-400 font-medium">
                        Check your email
                    </p>
                    <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-1">
                        We've sent a password reset link to your email address.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center mt-4 text-sm font-medium text-foreground hover:underline"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to login
                    </Link>
                </div>
            ) : (
                <form action={action} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            required
                            className="h-11 bg-background border-border focus-visible:ring-primary"
                        />
                        {state?.errors?.email && (
                            <p className="text-sm text-red-500">
                                {state.errors.email[0]}
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
                        Send Reset Link
                    </Button>

                    <div className="text-center">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-foreground hover:underline inline-flex items-center"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to login
                        </Link>
                    </div>
                </form>
            )}
        </div>
    );
}
