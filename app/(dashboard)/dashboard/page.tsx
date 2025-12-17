import React from "react";
import { RecentsList } from "@/components/dashboard/RecentsList";
import { ResourceGrid } from "@/components/dashboard/ResourceGrid";
import { AIUploadCard } from "@/components/dashboard/AIUploadCard";
import { MobileQuickActions } from "@/components/dashboard/MobileQuickActions";

import { DashboardToast } from "@/components/dashboard/DashboardToast";
import { getRecommendedResources } from "@/lib/resources";
import { listUserGenerations } from "@/app/actions/ai";
import { getCurrentUser } from "@/lib/auth/session";
import { mapGenerationToRecentItem } from "@/lib/ai/mappers";

export default async function StudentDashboard() {
    const user = await getCurrentUser();
    if (!user) return null;

    const recommendedResources = await getRecommendedResources(6);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentGenerations = await listUserGenerations({ limit: 4 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentItems = recentGenerations.map((gen: any) =>
        mapGenerationToRecentItem(gen, "You")
    );

    const resourcesForGrid = recommendedResources.map((r) => ({
        id: r.resource_id,
        title: r.title,
        rating: r.rating || 0,
        reviews: r.reviews || 0,
        description: r.description || "",
        tags: r.tags,
        downloads: r.downloads || 0,
        comments: r.comments || 0,
        isAI: r.is_ai || false,
        isVerified: r.is_verified || false,
        fileUrl: r.file_url,
        mimeType: r.mime_type || undefined,
    }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8">
            <DashboardToast />
            <div className="space-y-10">
                <MobileQuickActions />
                {recentItems.length > 0 ? (
                    <div>
                        <h3 className="text-lg font-serif font-bold text-[#0A251D] mb-4">
                            Recents
                        </h3>
                        <RecentsList items={recentItems} />
                    </div>
                ) : (
                    <div className="mb-12">
                        <h3 className="text-sm font-bold text-[#0A251D]/70 mb-4">
                            Recents Created Content
                        </h3>
                        <div className="rounded-xl border border-dashed border-[#0A251D]/30 bg-white/60 p-6 text-sm text-[#0A251D]">
                            You haven't generated any content yet. Start a chat
                            or use the AI tools to create study materials.
                        </div>
                    </div>
                )}

                <ResourceGrid
                    title="Recommended for You"
                    viewAllLink="/resources"
                    resources={resourcesForGrid}
                />
            </div>

            <div className="hidden lg:block space-y-6">
                <AIUploadCard />
            </div>
        </div>
    );
}
