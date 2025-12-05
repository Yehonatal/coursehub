import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Timestamp } from "@/components/ui/Timestamp";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full font-sans">
            <div className="flex flex-1 flex-col px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-[#F9F9F9]">
                <div className="mb-10">
                    <Link href="/" className="flex items-center gap-2 w-fit">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0A251D] text-white">
                            <span className="text-2xl font-serif font-bold">
                                H
                            </span>
                        </div>
                        <span className="sr-only">CourseHub</span>
                    </Link>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="mx-auto w-full max-w-md">{children}</div>
                </div>
                <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
                    <p>
                        <Timestamp /> CourseHub. All rights reserved.
                    </p>
                    <div className="flex gap-2">
                        <Link
                            href="/privacy"
                            className="hover:underline hover:text-[#0A251D]"
                        >
                            Privacy Policy
                        </Link>
                        <span>•</span>
                        <Link
                            href="/terms"
                            className="hover:underline hover:text-[#0A251D]"
                        >
                            Term & Condition
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block lg:w-1/2 relative bg-[#0A251D]">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center z-10">
                    <h1 className="text-5xl font-serif font-medium mb-6">
                        Elevate your academic journey.
                    </h1>
                    <p className="text-lg text-white/80 max-w-lg leading-relaxed">
                        Join thousands of students and educators on the most
                        advanced adaptive learning platform in Ethiopia.
                    </p>
                </div>
                {/* Abstract Pattern Overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('/auth-pattern.png')] bg-cover bg-center mix-blend-overlay"></div>
            </div>
        </div>
    );
}
