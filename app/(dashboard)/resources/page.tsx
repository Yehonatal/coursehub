import React from "react";
import { FilterSidebar } from "@/components/resources/filters/FilterSidebar";
import { PopularResourcesList } from "@/components/resources/PopularResourcesList";
import { ResourceCard } from "@/components/common/ResourceCard";
import { searchResources, getPopularAIGenerations } from "@/lib/resources";

export default async function ResourcesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const query = typeof params.q === "string" ? params.q : undefined;
    const university =
        typeof params.university === "string" ? params.university : undefined;
    const courseCode =
        typeof params.courseCode === "string" ? params.courseCode : undefined;
    const semester =
        typeof params.semester === "string" ? params.semester : undefined;
    const resourceType =
        typeof params.resourceType === "string"
            ? params.resourceType
            : undefined;
    const dateRange =
        typeof params.dateRange === "string" ? params.dateRange : undefined;
    const tags =
        typeof params.tags === "string"
            ? params.tags.split(",").map((t) => t.trim())
            : undefined;

    const [resources, popularAI] = await Promise.all([
        searchResources({
            query,
            university,
            courseCode,
            semester,
            resourceType,
            dateRange,
            tags,
        }),
        getPopularAIGenerations(4),
    ]);

    const resourcesForGrid = resources.map((r) => ({
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
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
                        Explore Resources
                    </h1>
                    <p className="text-muted-foreground/70 font-medium">
                        Discover high-quality study materials shared by your
                        community.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
                {/* Sidebar Filters */}
                <aside className="hidden lg:block sticky top-24 self-start">
                    <FilterSidebar />
                </aside>

                <div className="space-y-12">
                    <PopularResourcesList resources={popularAI} />

                    <div className="space-y-8">
                        <h3 className="text-xl font-serif font-bold text-primary">
                            All Resources
                        </h3>
                        {resourcesForGrid.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                {resourcesForGrid.map((resource) => (
                                    <ResourceCard
                                        key={resource.id}
                                        {...resource}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-muted/5 rounded-4xl border border-dashed border-border/60">
                                <p className="text-muted-foreground font-medium">
                                    No resources found matching your filters.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
