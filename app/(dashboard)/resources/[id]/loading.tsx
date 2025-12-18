import React from "react";
import {
    ResourceBannerSkeleton,
    ResourceHeaderSkeleton,
    ResourceContentSkeleton,
    ResourceSidebarSkeleton,
    RelatedResourcesSkeleton,
    CommentsSectionSkeleton,
} from "@/components/skeleton/ResourcePageSkeleton";

export default function Loading() {
    return (
        <div className="min-h-screen bg-background pb-20">
            <ResourceBannerSkeleton />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <ResourceHeaderSkeleton />
                        <ResourceContentSkeleton />
                        <RelatedResourcesSkeleton />
                        <CommentsSectionSkeleton />
                    </div>

                    <div className="lg:col-span-4">
                        <ResourceSidebarSkeleton />
                    </div>
                </div>
            </div>
        </div>
    );
}
