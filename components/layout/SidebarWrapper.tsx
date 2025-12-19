"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { QuickUploadCard } from "@/components/dashboard/QuickUploadCard";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const hideSidebarPaths = [
        "/dashboard/profile",
        "/resources",
        "/university",
    ];
    const shouldHideSidebar = hideSidebarPaths.some((path) =>
        pathname.startsWith(path)
    );

    if (shouldHideSidebar) {
        return <>{children}</>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[2.15fr_9.5fr] gap-8">
            <div className="hidden lg:block space-y-8 sticky top-20 self-start">
                <ProfileCard />
                <QuickUploadCard />
            </div>
            <div className="w-full min-w-0">{children}</div>
        </div>
    );
}
