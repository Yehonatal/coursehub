import React from "react";
import UniversityBadge from "@/components/common/UniversityBadge";
import { notFound } from "next/navigation";
import { ResourceHeader } from "@/components/resources/ResourceHeader";
import { ResourceContent } from "@/components/resources/ResourceContent";
import { ResourceSidebar } from "@/components/resources/ResourceSidebar";
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

    const relatedResources = await getRelatedResources(
        id,
        resource.university ?? "",
        3
    );

    const author = resource.author?.name || "Unknown";
    const authorUniversity =
        resource.author?.university || resource.university || "";
    const uploadDate = new Date(resource.upload_date);

    return (
        <div className="min-h-screen bg-[#F9F9F9] pb-20">
            <ViewTracker resourceId={id} />
            <div className="w-full border-b border-border/40">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                    <div className="h-20 sm:h-38 w-full rounded-[2rem] bg-linear-to-br from-primary/10 via-primary/5 to-transparent relative overflow-hidden border-x border-t border-border/40">
                        <div
                            className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle, currentColor 1px, transparent 1px)",
                                backgroundSize: "24px 24px",
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex items-center gap-4 md:gap-6 opacity-80">
                                <div className="relative h-16 w-16 md:h-20 md:w-20">
                                    <UniversityBadge
                                        university={
                                            resource.university ||
                                            authorUniversity
                                        }
                                        size={80}
                                    />
                                </div>
                                <div className="space-y-0.5">
                                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
                                        {resource.university ||
                                            authorUniversity}
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/40" />
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
                        />
                        {resource.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {resource.tags.map((t, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[12px] font-medium rounded"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}

                        <ResourceContent
                            description={resource.description ?? ""}
                            studyTime="N/A"
                            objectives={[]}
                        />

                        {/* <ResourceGenerations generations={generations} /> */}

                        <RelatedResources resources={relatedResources} />
                    </div>
                    <div className="lg:col-span-4 order-2 lg:order-2">
                        <ResourceSidebar
                            generations={generations}
                            resourceId={id}
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
