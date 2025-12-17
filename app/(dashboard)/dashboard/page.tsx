import React from "react";
import { RecentsList } from "@/components/dashboard/RecentsList";
import { ResourceGrid } from "@/components/dashboard/ResourceGrid";
import { AIUploadCard } from "@/components/dashboard/AIUploadCard";
import { MobileQuickActions } from "@/components/dashboard/MobileQuickActions";

import { DashboardToast } from "@/components/dashboard/DashboardToast";
import { getRecommendedResources } from "@/lib/resources";
import { listUserGenerations } from "@/app/actions/ai";
import { getCurrentUser } from "@/lib/auth/session";

export default async function StudentDashboard() {
    const user = await getCurrentUser();
    if (!user) return null;

    const recommendedResources = await getRecommendedResources(6);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentGenerations = await listUserGenerations({ limit: 4 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recentItems = recentGenerations.map((gen: any) => ({
        title:
            gen.title ||
            gen.prompt?.substring(0, 30) +
                (gen.prompt?.length > 30 ? "..." : "") ||
            gen.generationType.charAt(0).toUpperCase() +
                gen.generationType.slice(1),
        type:
            gen.generationType === "notes"
                ? "Note"
                : gen.generationType === "tree"
                ? "Knowledge Tree"
                : "Flashcards",
        meta:
            gen.generationType === "notes"
                ? "Study Notes"
                : gen.generationType === "tree"
                ? `${gen.content.nodes?.length || 0} Nodes`
                : `${gen.content.length || 0} Cards`,
        author: "You",
        iconType:
            gen.generationType === "notes"
                ? "note"
                : gen.generationType === "tree"
                ? "tree"
                : "question",
        data: gen.content,
    }));

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
                {recentItems.length > 0 && (
                    <div>
                        <h3 className="text-lg font-serif font-bold text-[#0A251D] mb-4">
                            Recents
                        </h3>
                        <RecentsList items={recentItems} />
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
