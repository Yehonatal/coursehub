import React from "react";
import { RecentsList } from "@/components/dashboard/RecentsList";
import { ResourceGrid } from "@/components/dashboard/ResourceGrid";
import { AIUploadCard } from "@/components/dashboard/AIUploadCard";
import { MobileQuickActions } from "@/components/dashboard/MobileQuickActions";
import { mockDelay } from "@/utils/helpers";
import { DashboardToast } from "@/components/dashboard/DashboardToast";
import { getRecommendedResources } from "@/lib/resources";

export default async function StudentDashboard() {
    await mockDelay();
    const recommendedResources = await getRecommendedResources(6);

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
                <RecentsList
                    items={[
                        {
                            title: "Project Management",
                            type: "Note",
                            meta: "45 min read",
                            author: "Yonatan .A",
                            iconType: "note",
                        },
                        {
                            title: "Object Oriented Systems Analysis and Design",
                            type: "Knowledge Tree",
                            meta: "20 Terms",
                            author: "Yonatan .A",
                            iconType: "tree",
                        },
                        {
                            title: "Advanced Database systems",
                            type: "Questions",
                            meta: "35 questions",
                            author: "Yonatan .A",
                            iconType: "question",
                        },
                    ]}
                />

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
