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
        <div className="flex min-h-screen w-full">
            <div className="flex flex-1 flex-col px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-white">
                <div className="flex-1 flex flex-col justify-center">
                    <div className="mx-auto w-full max-w-3xl">{children}</div>
                </div>
                <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
                    <p>
                        <Timestamp /> CourseHub. All rights reserved.
                    </p>
                    <div className="flex gap-2">
                        <Link href="/privacy" className="hover:underline">
                            Privacy Policy
                        </Link>
                        <span>•</span>
                        <Link href="/terms" className="hover:underline">
                            Term & Condition
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block lg:w-1/2 relative bg-gray-50">
                <Image
                    src="/auth-pattern.png"
                    alt="Authentication background"
                    fill
                    className="object-cover p-6 "
                    priority
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-teal-900 opacity-20">
                        Course Hub
                    </h1>
                </div>
            </div>
        </div>
    );
}
