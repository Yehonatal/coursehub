import React from "react";
import Link from "next/link";
import { Timestamp } from "@/components/ui/Timestamp";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full font-sans bg-primary lg:bg-background lg:flex-row overflow-x-hidden">
            <div className="absolute inset-0 z-0 lg:hidden overflow-hidden pointer-events-none">
                <div className="absolute inset-0 opacity-20 bg-[url('/auth-pattern.png')] bg-cover bg-center mix-blend-soft-light data-[theme=midnight]:opacity-40 data-[theme=midnight]:mix-blend-screen"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-primary-foreground/5 blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[200px] h-[200px] rounded-full bg-primary-foreground/5 blur-3xl" />
            </div>

            <div className="relative z-10 flex w-full lg:w-1/2 flex-col justify-center px-4 py-8 sm:px-6 lg:px-20 xl:px-24 lg:bg-background">
                <div className="bg-card rounded-3xl shadow-2xl p-6 sm:p-8 lg:shadow-none lg:p-0 lg:bg-transparent lg:rounded-none w-full max-w-md mx-auto lg:max-w-full">
                    <div className="mb-8 lg:mb-10">
                        <Link
                            href="/"
                            className="flex items-center gap-2 w-fit"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <span className="text-2xl font-serif font-bold">
                                    H
                                </span>
                            </div>
                            <span className="sr-only">CourseHub</span>
                        </Link>
                    </div>

                    <div className="flex-1 flex flex-col justify-center w-full max-w-md mx-auto lg:max-w-xl lg:mx-0">
                        {children}
                    </div>

                    <div className="mt-8 lg:mt-12 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-muted-foreground gap-4 sm:gap-0 border-t border-border/10 pt-6 lg:border-none lg:pt-0">
                        <p className="text-center sm:text-left">
                            <Timestamp /> CourseHub. All rights reserved.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="/privacy"
                                className="hover:underline hover:text-primary transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms"
                                className="hover:underline hover:text-primary transition-colors"
                            >
                                Terms & Conditions
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex lg:flex-1 relative bg-primary overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground p-12 text-center z-10">
                    <h1 className="text-4xl xl:text-5xl font-serif font-medium mb-6 tracking-tight">
                        Elevate your academic journey.
                    </h1>
                    <p className="text-lg text-primary-foreground/80 max-w-lg leading-relaxed">
                        Join our community of students and educators on a
                        university‑aligned learning hub for Ethiopian
                        universities.
                    </p>
                </div>
                <div className="absolute inset-0 opacity-20 bg-[url('/auth-pattern.png')] bg-cover bg-center mix-blend-soft-light data-[theme=midnight]:opacity-40 data-[theme=midnight]:mix-blend-screen"></div>

                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary-foreground/5 blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-primary-foreground/5 blur-3xl" />
            </div>
        </div>
    );
}
