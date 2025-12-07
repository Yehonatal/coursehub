"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusSquare, Bell, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/utils/cn";
import { UploadModal } from "@/components/dashboard/UploadModal";

export function BottomNav() {
    const pathname = usePathname();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const items = [
        {
            label: "Home",
            icon: Home,
            href: "/user",
        },
        {
            label: "Resources",
            icon: BookOpen,
            href: "/resources",
        },
        {
            label: "AI",
            icon: Sparkles,
            href: "/ai",
        },
        {
            label: "Post",
            icon: PlusSquare,
            href: "#",
            onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                setIsUploadModalOpen(true);
            },
        },
        {
            label: "Notifications",
            icon: Bell,
            href: "/user/notifications",
        },
    ];

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border/40 pb-safe md:hidden">
                <div className="flex items-center justify-around h-16">
                    {items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={item.onClick}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
                                    isActive
                                        ? "text-[#0A251D]"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "h-6 w-6",
                                        isActive && "fill-current"
                                    )}
                                />
                                <span className="text-[10px] font-medium">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />
        </>
    );
}
