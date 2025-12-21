import React from "react";
import { RecentsList } from "@/components/dashboard/RecentsList";
import { ResourceGrid } from "@/components/dashboard/ResourceGrid";
import { AIUploadCard } from "@/components/dashboard/AIUploadCard";
import { MobileQuickActions } from "@/components/dashboard/MobileQuickActions";

import { DashboardToast } from "@/components/dashboard/DashboardToast";
import { getRecommendedResources } from "@/lib/resources";
import { listUserGenerations } from "@/app/actions/ai";
import { getCurrentUser } from "@/lib/auth/session";
import { mapGenerationToRecentItem } from "@/utils/mappers";

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
        verifier: r.verifier,
    }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8">
            <DashboardToast />
            <div className="space-y-10">
                <MobileQuickActions />
                {recentItems.length > 0 ? (
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                                Continue Learning
                            </p>
                            <h3 className="text-2xl font-serif font-semibold text-primary tracking-tight">
                                Recent Activity
                            </h3>
                        </div>
                        <RecentsList items={recentItems} />
                    </div>
                ) : (
                    <div className="mb-12 space-y-6">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                                Getting Started
                            </p>
                            <h3 className="text-2xl font-serif font-semibold text-primary tracking-tight">
                                Recent Activity
                            </h3>
                        </div>
                        <div className="rounded-[2rem] border border-dashed border-border/60 bg-muted/5 p-12 text-center space-y-3">
                            <p className="text-sm text-muted-foreground font-medium">
                                You haven't generated any content yet.
                            </p>
                            <p className="text-xs text-muted-foreground/60">
                                Start a chat or use the AI tools to create study
                                materials.
                            </p>
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
