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
                    className="inline-flex items-center justify-center text-sm font-medium text-[#0A251D] hover:underline"
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
                <h1 className="text-3xl font-serif font-medium tracking-tight text-[#0A251D]">
                    Reset{" "}
                    <HandDrawnUnderline className="text-[#F5A623]">
                        password
                    </HandDrawnUnderline>
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your new password below.
                </p>
            </div>

            {state.success ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-green-800 font-medium">
                        Password Reset Successful
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                        Your password has been updated. You can now log in with
                        your new password.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center mt-4 px-4 py-2 bg-[#0A251D] text-white rounded-md text-sm font-medium hover:bg-[#0A251D]/90"
                    >
                        Log in
                    </Link>
                </div>
            ) : (
                <form action={action} className="space-y-6">
                    <input type="hidden" name="token" value={token} />

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-[#0A251D]">
                            New Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                className="h-11 bg-white border-gray-200 focus-visible:ring-[#0A251D] pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
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
                            className="text-[#0A251D]"
                        >
                            Confirm Password
                        </Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="h-11 bg-white border-gray-200 focus-visible:ring-[#0A251D]"
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
                        className="w-full h-11 bg-[#0A251D] hover:bg-[#0A251D]/90 text-white font-medium"
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
