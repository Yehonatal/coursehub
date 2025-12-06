import React from "react";
import {
    ProfileHeaderSkeleton,
    ProfileStatsSkeleton,
    ProfileRecentsSkeleton,
} from "@/components/skeleton/ProfilePageSkeleton";

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto pb-12 space-y-8 px-4 sm:px-6 lg:px-8">
            <ProfileHeaderSkeleton />
            <ProfileStatsSkeleton />
            <ProfileRecentsSkeleton />
            <div className="space-y-4">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
                <ProfileRecentsSkeleton />
            </div>
        </div>
    );
}
