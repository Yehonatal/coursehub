"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { HandDrawnShape } from "@/components/ui/decorations";
import { FolderOpen } from "lucide-react";
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
}

export function ProfileCard({
    name,
    role,
    university,
    department,
    location,
    avatarUrl,
    type = "student",
    badge = "Student",
}: ProfileCardProps) {
    const { user } = useUser();

    const displayName =
        name || (user ? `${user.first_name} ${user.last_name}` : "Guest User");
    const displayRole =
        role || (user?.role === "educator" ? "Educator" : "Student");
    const displayUniversity = university || user?.university || "No University";
    const displayLocation = location || "Addis Ababa, Ethiopia"; // Could be dynamic if we had location in user
    const displayAvatar = avatarUrl || "https://github.com/shadcn.png"; // Placeholder
    const displayType =
        type || (user?.role === "educator" ? "university" : "student"); // Mapping educator to university type for now, adjust as needed

    return (
        <Card
            className="overflow-hidden border-border/60 bg-white group transition-all duration-300"
            data-aos="fade-up"
        >
            <div className="h-24 bg-[#0A251D]/5 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            "radial-gradient(#0A251D 1px, transparent 1px)",
                        backgroundSize: "10px 10px",
                    }}
                ></div>
                <div className="absolute -right-4 -top-4 opacity-30 rotate-12 z-10">
                    <HandDrawnShape className="w-32 h-32 text-[#0A251D]" />
                </div>
            </div>
            <div className="px-4 pb-6 sm:px-6 relative">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-4 border-white bg-gray-200 absolute -top-20 sm:-top-24 overflow-hidden shadow-sm z-20">
                    <Image
                        src={displayAvatar}
                        alt="Profile"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="mt-10 space-y-1 sm:mt-12">
                    <h2 className="text-xl font-serif font-bold text-[#0A251D]">
                        {displayName}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {displayRole}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        {badge && (
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium">
                                {badge}
                            </span>
                        )}
                        <span>•</span>
                        <span>{displayLocation}</span>
                    </div>
                </div>

                {displayType === "student" && displayUniversity && (
                    <Link
                        href={`/university/${displayUniversity
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        className="mt-6 pt-6 border-t border-border/40 flex items-center gap-3 hover:bg-gray-50 transition-colors rounded-md p-2 -mx-2"
                    >
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">
                            {displayUniversity.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            <p className="font-medium text-foreground">
                                {displayUniversity}
                            </p>
                            <p>{department || "Department"}</p>
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
