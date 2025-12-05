"use client";

import { useActionState, useState } from "react";
import { signIn, type ActionResponse } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";

const initialState: ActionResponse = {
    success: false,
    message: "",
};

export function LoginForm() {
    const [state, action, isPending] = useActionState(signIn, initialState);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="w-full space-y-8">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-3xl font-serif font-medium tracking-tight text-[#0A251D]">
                    Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your credentials to access your account
                </p>
            </div>

            <form action={action} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#0A251D]">
                        Email
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        className="h-11 bg-white border-gray-200 focus-visible:ring-[#0A251D]"
                    />
                    {state?.errors?.email && (
                        <p className="text-sm text-red-500">
                            {state.errors.email[0]}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#0A251D]">
                        Password
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
                    Sign In
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-muted-foreground">
                    Don&apos;t have an account?{" "}
                </span>
                <Link
                    href="/register"
                    className="font-medium text-[#0A251D] hover:underline underline-offset-4"
                >
                    Sign up
                </Link>
            </div>
        </div>
    );
}
