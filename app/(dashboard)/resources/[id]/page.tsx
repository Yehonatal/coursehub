import React from "react";
import UniversityBadge from "@/components/common/UniversityBadge";
import { notFound } from "next/navigation";
import { ResourceHeader } from "@/components/resources/ResourceHeader";
import { ResourceContent } from "@/components/resources/ResourceContent";
import { ResourceSidebar } from "@/components/resources/ResourceSidebar";
import { RelatedResources } from "@/components/common/RelatedResources";
import { CommentsSection } from "@/components/common/CommentsSection";
import { mockDelay } from "@/utils/helpers";
import {
    getResourceById,
    getResourceStats,
    getResourceComments,
    getRelatedResources,
} from "@/lib/resources";
import { ViewTracker } from "@/components/resources/ViewTracker";
import { getCurrentUser } from "@/lib/auth/session";
import { getResourceGenerations } from "@/app/actions/ai";
import { ResourceGenerations } from "@/components/resources/ResourceGenerations";

interface ResourcePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ResourcePage({ params }: ResourcePageProps) {
    await mockDelay();

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
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <ViewTracker resourceId={id} />
            <div className="w-full border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="h-32 sm:h-48 w-full rounded-t-xl bg-white border border-border/60 relative overflow-hidden group">
                        <div className="absolute inset-0 flex items-center justify-center bg-linear-to-r from-green-50 to-emerald-50">
                            <div className="flex items-center gap-4 opacity-80">
                                <div className="relative h-16 w-16">
                                    <UniversityBadge
                                        university={
                                            resource.university ||
                                            authorUniversity
                                        }
                                        size={64}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-3xl font-serif font-bold text-green-700">
                                        {resource.university ||
                                            authorUniversity}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8 order-1 lg:order-1">
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

                        <ResourceGenerations generations={generations} />

                        <RelatedResources resources={relatedResources} />
                    </div>
                    <div className="lg:col-span-4 order-2 lg:order-2">
                        <ResourceSidebar />
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
