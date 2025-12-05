"use client";

import { useActionState } from "react";
import { signUp, type ActionResponse } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const initialState: ActionResponse = {
    success: false,
    message: "",
};

export function RegisterForm() {
    const [state, action, isPending] = useActionState(signUp, initialState);

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">
                    Register to Course Hub
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form action={action} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                placeholder="Enter your first name"
                                required
                            />
                            {state?.errors?.firstName && (
                                <p className="text-sm text-red-500">
                                    {state.errors.firstName[0]}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                placeholder="Enter your last name"
                                required
                            />
                            {state?.errors?.lastName && (
                                <p className="text-sm text-red-500">
                                    {state.errors.lastName[0]}
                                </p>
                            )}
                        </div>
                    </div>

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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="accountType">
                                Select Account Type
                            </Label>
                            <Select
                                id="accountType"
                                name="accountType"
                                required
                            >
                                <option value="student">Student</option>
                                <option value="educator">Educator</option>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="university">University</Label>
                            <Select
                                id="university"
                                name="university"
                                required
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Select your University
                                </option>
                                <option value="aau">Haramaya University</option>
                                <option value="aau">
                                    Addis Ababa University
                                </option>
                                <option value="aastu">AASTU</option>
                                <option value="astu">ASTU</option>
                                <option value="other">Other</option>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
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
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    Confirm password
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm password"
                                    required
                                />
                                {state?.errors?.confirmPassword && (
                                    <p className="text-sm text-red-500">
                                        {state.errors.confirmPassword[0]}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="schoolId">School ID</Label>
                            <FileUpload id="schoolId" name="schoolId" />
                        </div>
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
                        {isPending ? "Registering..." : "Register"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                    Got an account?{" "}
                    <Link
                        href="/login"
                        className="text-primary hover:underline"
                    >
                        Login here!
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
