"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HandDrawnShape } from "@/components/ui/decorations";
import { FolderOpen, BadgeCheck, MapPin } from "lucide-react";
import { useUser } from "@/components/providers/UserProvider";

interface ProfileCardProps {
    // Optional props to override user data if needed
    name?: string;
    role?: string;
    university?: string;
    department?: string;
    location?: string;
    avatarUrl?: string;
    type?: "student" | "university";
    badge?: string;
    headline?: string;
}

export function ProfileCard({
    name,
    role,
    university,
    department,
    location,
    avatarUrl,
    type = "student",
    badge,
    headline,
}: ProfileCardProps) {
    const { user } = useUser();

    const displayName =
        name || (user ? `${user.first_name} ${user.last_name}` : "Guest User");
    const displayRole =
        role || (user?.role === "educator" ? "Educator" : "Student");
    const displayUniversity = university || user?.university || "No University";
    const displayLocation = location || "Addis Ababa, Ethiopia"; // Could be dynamic if we had location in user
    const displayAvatar =
        avatarUrl || user?.profile_image_url || "https://github.com/shadcn.png";
    const displayBanner = user?.banner_url;
    const displayType =
        type || (user?.role === "educator" ? "university" : "student"); // Mapping educator to university type for now, adjust as needed
    const displayHeadline = headline || user?.headline;
    const displayBadge =
        badge || (user?.role === "educator" ? "Educator" : "Student");

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Use setTimeout to avoid "synchronous setState" warnings in some environments
        const timer = setTimeout(() => setIsMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Card
            className="overflow-hidden border-border bg-card group transition-all duration-300 rounded-3xl shadow-sm hover:shadow-md"
            data-aos="fade-up"
        >
            <div className="h-28 bg-linear-to-br from-primary/5 via-transparent to-transparent relative overflow-hidden">
                {displayBanner ? (
                    <Image
                        src={displayBanner}
                        alt="Banner"
                        fill
                        className="object-cover opacity-90"
                    />
                ) : (
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle, currentColor 1px, transparent 1px)",
                            backgroundSize: "20px 20px",
                        }}
                    ></div>
                )}
                <div className="absolute -right-4 -top-4 opacity-10 rotate-12 z-10">
                    <HandDrawnShape className="w-32 h-32 text-primary" />
                </div>
            </div>
            <div className="px-6 pb-8 relative">
                <div className="h-16 w-16 rounded-full border border-background bg-card absolute -top-20 left-4 overflow-hidden shadow-lg z-20">
                    <Image
                        src={displayAvatar}
                        alt="Profile"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="mt-14 space-y-2">
                    <h2 className="text-xl font-serif font-semibold text-foreground flex items-center gap-2 tracking-tight">
                        {displayName}
                        {isMounted && user?.is_verified ? (
                            <BadgeCheck className="h-5 w-5 text-primary fill-primary/10" />
                        ) : isMounted && user ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20 whitespace-nowrap">
                                Not Verified
                            </span>
                        ) : null}
                    </h2>
                    <p className="text-sm text-muted-foreground/80 font-medium leading-relaxed">
                        {displayHeadline || displayRole}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground/60 font-medium pt-1">
                        {displayBadge && (
                            <span className="px-2.5 py-1 rounded-full bg-muted/30 text-muted-foreground border border-border/50">
                                {displayBadge}
                            </span>
                        )}
                        <span className="h-1 w-1 rounded-full bg-border" />
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {displayLocation}
                        </span>
                    </div>
                </div>

                {displayType === "student" && displayUniversity && (
                    <Link
                        href={`/university/${displayUniversity
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        className="mt-8 pt-6 border-t border-border/40 flex items-center gap-4 hover:bg-muted/5 transition-all rounded-2xl p-3 -mx-3 group/uni"
                    >
                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold text-xs group-hover/uni:bg-primary group-hover/uni:text-white transition-colors">
                            {displayUniversity.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-sm font-semibold text-primary tracking-tight">
                                {displayUniversity}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                                {department || "Department"}
                            </p>
                        </div>
                    </Link>
                )}

                {displayType === "university" && (
                    <div className="mt-6 pt-6 border-t border-border/40">
                        <div className="flex items-center gap-2 text-[#0A251D] font-medium mb-3">
                            <FolderOpen className="h-4 w-4" />
                            <span className="text-sm">Upload File</span>
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-6 flex flex-col items-center justify-center text-center gap-2 border-dashed">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-1">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                    />
                                </svg>
                            </div>
                            <p className="text-xs font-medium text-blue-900">
                                Drag and drop or Browse
                            </p>
                            <p className="text-[10px] text-blue-600/70">
                                Max file size 20MB
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
