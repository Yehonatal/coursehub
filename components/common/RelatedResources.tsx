import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourceCard } from "@/components/common/ResourceCard";
import { ResourceWithTags } from "@/lib/resources";

interface RelatedResourcesProps {
    resources: ResourceWithTags[];
}

export function RelatedResources({ resources }: RelatedResourcesProps) {
    if (!resources || resources.length === 0) return null;

    return (
        <div className="space-y-6 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0A251D]">
                    Recommended Resources
                </h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource) => (
                    <ResourceCard
                        key={resource.resource_id}
                        id={resource.resource_id}
                        title={resource.title}
                        rating={resource.rating || 0}
                        reviews={resource.reviews || 0}
                        description={resource.description || ""}
                        tags={resource.tags}
                        downloads={resource.downloads || 0}
                        comments={resource.comments || 0}
                        isVerified={resource.is_verified}
                        verifier={resource.verifier}
                        fileUrl={resource.file_url}
                        mimeType={resource.mime_type || undefined}
                    />
                ))}
            </div>
        </div>
    );
}
