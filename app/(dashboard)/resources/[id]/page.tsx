import React from "react";
import UniversityBadge from "@/components/common/UniversityBadge";
import { notFound } from "next/navigation";
import { ResourceHeader } from "@/components/resources/ResourceHeader";
import { ResourceContent } from "@/components/resources/ResourceContent";
import { ResourceSidebar } from "@/components/resources/ResourceSidebar";
import { ResourceGenerations } from "@/components/resources/ResourceGenerations";
import { RelatedResources } from "@/components/common/RelatedResources";
import { CommentsSection } from "@/components/common/CommentsSection";

import {
    getResourceById,
    getResourceStats,
    getResourceComments,
    getRelatedResources,
} from "@/lib/resources";
import { ViewTracker } from "@/components/resources/ViewTracker";
import { getCurrentUser } from "@/lib/auth/session";
import { getResourceGenerations } from "@/app/actions/ai";

interface ResourcePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ResourcePage({ params }: ResourcePageProps) {
    const { id } = await params;
    const user = await getCurrentUser();
    const resource = await getResourceById(id);
    const stats = await getResourceStats(id);
    const comments = await getResourceComments(id);
    const generations = await getResourceGenerations(id);

    if (!resource) {
        notFound();
    }

    const isOwner = user?.user_id === resource.uploader_id;
    const isPremium =
        user?.subscription_status === "pro" ||
        user?.subscription_status === "active";

    const relatedResources = await getRelatedResources(
        id,
        resource.university ?? "",
        3
    );

    const author = resource.author?.name || "Unknown";
    const authorUniversity =
        resource.author?.university || resource.university || "";
    const uploadDate = new Date(resource.upload_date);

    // Estimate study time from file size (simple heuristic: ~100KB per minute)
    const estimateStudyTime = (size?: number | null) => {
        if (!size || typeof size !== "number") return "N/A";
        const minutes = Math.max(1, Math.round(size / 10000));
        return `${minutes} min`;
    };

    const studyTime = estimateStudyTime(resource.file_size);
    console.log("Study Time:", studyTime);

    return (
        <div className="min-h-screen bg-background pb-20">
            <ViewTracker resourceId={id} />
            <div className="w-full border-b border-border/40">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                    <div className="h-24 sm:h-48 w-full rounded-3xl  relative overflow-hidden border border-border/50">
                        <div
                            className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage: `
                                    linear-gradient(to right, currentColor 1px, transparent 1px),
                                    linear-gradient(to bottom, currentColor 1px, transparent 1px)
                                `,
                                backgroundSize: "40px 40px",
                            }}
                        ></div>

                        <div
                            className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Ffilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                            }}
                        ></div>

                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700"></div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex items-center gap-4 md:gap-6 opacity-90">
                                <div className="relative h-16 w-16 md:h-20 md:w-20 drop-shadow-2xl">
                                    <UniversityBadge
                                        university={
                                            resource.university ||
                                            authorUniversity
                                        }
                                        size={80}
                                    />
                                </div>
                                <div className="space-y-0.5">
                                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight drop-shadow-sm">
                                        {resource.university ||
                                            authorUniversity}
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/20 to-transparent" />
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-12 order-1 lg:order-1">
                        <ResourceHeader
                            title={resource.title}
                            rating={stats.rating}
                            reviews={stats.reviews}
                            downloads={stats.downloads}
                            courseCode={resource.course_code ?? ""}
                            type={resource.resource_type ?? ""}
                            date={uploadDate.toLocaleDateString()}
                            author={author}
                            university={authorUniversity}
                            department=""
                            fileUrl={resource.file_url}
                            resourceId={resource.resource_id}
                            isOwner={isOwner}
                            isVerified={resource.is_verified}
                            verifier={resource.verifier}
                            resourceData={{
                                courseCode: resource.course_code ?? "",
                                semester: resource.semester ?? "",
                                university: resource.university ?? "",
                                type: resource.resource_type ?? "",
                                description: resource.description ?? "",
                                tags: resource.tags.join(","),
                                fileUrl: resource.file_url ?? "",
                                fileName:
                                    (resource.file_url || "")
                                        .split("/")
                                        .pop() || "",
                            }}
                            studyTime={studyTime}
                        />
                        {resource.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {resource.tags.map((t, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-0.5 bg-muted text-muted-foreground text-[12px] font-medium rounded"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}

                        <ResourceContent
                            description={resource.description ?? ""}
                            studyTime={studyTime}
                            objectives={[]}
                        />

                        <ResourceGenerations
                            generations={generations}
                            isPremium={isPremium}
                        />

                        <RelatedResources resources={relatedResources} />
                    </div>
                    <div className="lg:col-span-4 order-2 lg:order-2">
                        <ResourceSidebar
                            generations={generations}
                            resourceId={id}
                            isPremium={isPremium}
                        />
                    </div>

                    <div className="lg:col-span-8 order-3 lg:order-3">
                        <CommentsSection
                            initialComments={comments}
                            initialCount={stats.comments}
                            resourceId={id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
