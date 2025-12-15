"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AIChatModal } from "@/components/ai/AIChatModal";
import { ResourceHeaderActions } from "./ResourceHeaderActions";
import { ResourceViewerModal } from "./ResourceViewerModal";
import { trackResourceDownload } from "@/app/actions/resource-tracking";
import UniversityBadge from "@/components/common/UniversityBadge";
import { useResourceStats } from "@/components/resources/useResourceStats";
import { useResourceRating } from "@/hooks/useResourceRating";
import { StarRating } from "@/components/common/StarRating";

interface ResourceHeaderProps {
    title: string;
    rating: number;
    reviews: number;
    downloads: number;
    courseCode: string;
    type: string;
    date: string;
    author: string;
    university: string;
    department: string;
    fileUrl?: string;
    resourceId?: string;
}

export function ResourceHeader({
    title,
    rating: serverRating,
    reviews: serverReviews,
    downloads: serverDownloads,
    courseCode,
    type,
    date,
    author,
    university,
    department,
    fileUrl,
    resourceId,
}: ResourceHeaderProps) {
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    // Use the hook for rating logic
    const {
        average,
        count,
        userRating,
        submitRating,
        loading: ratingLoading,
    } = useResourceRating(resourceId, serverRating, serverReviews);

    // Use stats hook for real-time updates if needed, or fallback to props/rating hook
    const { stats } = useResourceStats(resourceId || "");

    const displayRating = average ?? stats?.rating ?? serverRating;
    const displayCount = count ?? stats?.reviews ?? serverReviews;
    const displayDownloads = stats?.downloads ?? serverDownloads;

    const handleDownload = async () => {
        if (resourceId) {
            await trackResourceDownload(resourceId);
        }
        if (fileUrl) {
            window.open(fileUrl, "_blank");
        }
    };

    return (
        <div className="space-y-6">
            <AIChatModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                resourceId={resourceId}
            />

            {fileUrl && (
                <ResourceViewerModal
                    isOpen={isViewerOpen}
                    onClose={() => setIsViewerOpen(false)}
                    fileUrl={fileUrl}
                    title={title}
                />
            )}

            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-3">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0A251D]">
                        {title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <StarRating
                                value={userRating ?? displayRating}
                                onChange={submitRating}
                                readOnly={ratingLoading}
                            />
                            <span className="text-gray-600 font-medium">
                                {displayRating.toFixed(1)} / 5
                            </span>
                            <span className="text-gray-400">
                                ({displayCount} reviews)
                            </span>
                        </div>
                        <span className="text-gray-300 hidden sm:inline">
                            •
                        </span>
                        <div className="flex items-center gap-1 text-gray-600">
                            <Download className="w-4 h-4" />
                            <span>{displayDownloads} downloads</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-2">
                        <span className="font-medium text-[#0A251D]">
                            {courseCode}
                        </span>
                        <span>•</span>
                        <span>{type}</span>
                        <span>•</span>
                        <span>{date}</span>
                        <span>•</span>
                        <span>By {author}</span>
                    </div>

                    <div className="pt-2 w-fit">
                        <Badge variant="verified" label="Verified" />
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-3">
                    {university && (
                        <Link
                            href={`/university/${university
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, "")}`}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            <UniversityBadge
                                university={university}
                                size={48}
                            />
                            <div className="text-sm">
                                <p className="font-medium text-[#0A251D]">
                                    {university}
                                </p>
                                <p className="text-gray-500">{department}</p>
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            <ResourceHeaderActions
                onGenerateContent={() => setIsAIModalOpen(true)}
                onView={fileUrl ? () => setIsViewerOpen(true) : undefined}
                onDownload={fileUrl ? handleDownload : undefined}
            />
        </div>
    );
}
