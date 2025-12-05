"use client";

import { useActionState } from "react";
import { signIn, type ActionResponse } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const initialState: ActionResponse = {
    success: false,
    message: "",
};

export function LoginForm() {
    const [state, action, isPending] = useActionState(signIn, initialState);

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                    Course Hub
                </CardTitle>
                <CardDescription className="text-center">
                    Enter your email and password to sign in
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={action} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="example@gmail.com"
                            required
                        />
                        {state?.errors?.email && (
                            <p className="text-sm text-red-500">
                                {state.errors.email[0]}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                        />
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
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-primary hover:underline"
                    >
                        Register here!
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
