"use client";

import { useActionState } from "react";
import { signUp, type ActionResponse } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HandDrawnBox } from "@/components/ui/decorations";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { UniversitySelect } from "@/components/common/UniversitySelect";

const initialState: ActionResponse = {
    success: false,
    message: "",
};

export function RegisterForm() {
    const [state, action, isPending] = useActionState(signUp, initialState);

    return (
        <div className="w-full space-y-8">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">
                    Create an{" "}
                    <HandDrawnBox className="text-primary -rotate-2">
                        account
                    </HandDrawnBox>
                </h1>
                <p className="text-sm text-muted-foreground">
                    Join CourseHub to start your learning journey
                </p>
            </div>

            <form action={action} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-foreground">
                            First name
                        </Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            placeholder="John"
                            required
                            className="h-11 bg-background border-border focus-visible:ring-primary"
                        />
                        {state?.errors?.firstName && (
                            <p className="text-sm text-red-500">
                                {state.errors.firstName[0]}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-foreground">
                            Last name
                        </Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Doe"
                            required
                            className="h-11 bg-background border-border focus-visible:ring-primary"
                        />
                        {state?.errors?.lastName && (
                            <p className="text-sm text-red-500">
                                {state.errors.lastName[0]}
                            </p>
                        )}
                    </div>
                </div>

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

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="accountType"
                            className="text-foreground"
                        >
                            Account Type
                        </Label>
                        <div className="relative">
                            <select
                                id="accountType"
                                name="accountType"
                                required
                                className="flex h-11 w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="student">Student</option>
                                <option value="educator">Educator</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="university" className="text-foreground">
                            University
                        </Label>
                        <UniversitySelect
                            name="university"
                            required
                            error={state?.errors?.university?.[0]}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="schoolId" className="text-foreground">
                        School ID / Proof of Enrollment
                    </Label>
                    <div className="border border-dashed border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <Input
                            id="schoolId"
                            name="schoolId"
                            type="file"
                            accept="image/*,.pdf"
                            className="cursor-pointer border-0 bg-transparent p-0 h-auto file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-foreground">
                            Password
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="h-11 bg-background border-border focus-visible:ring-primary"
                        />
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
                    Create Account
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-muted-foreground">
                    Already have an account?{" "}
                </span>
                <Link
                    href="/login"
                    className="font-medium text-foreground hover:underline underline-offset-4"
                >
                    Sign in
                </Link>
            </div>
        </div>
    );
}
