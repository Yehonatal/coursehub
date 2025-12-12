"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AIChatModal } from "@/components/ai/AIChatModal";
import { ResourceHeaderActions } from "./ResourceHeaderActions";
import { ResourceViewerModal } from "./ResourceViewerModal";
import { trackResourceDownload } from "@/app/actions/resource-tracking";
import UniversityBadge from "@/components/common/UniversityBadge";
import { useResourceStats } from "@/components/resources/useResourceStats";

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
    rating,
    reviews,
    downloads,
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
    const { stats } = useResourceStats(resourceId);

    const handleDownload = async () => {
        if (!fileUrl) return;
        try {
            // Track download server-side
            if (resourceId) {
                await trackResourceDownload(resourceId);
            }
        } catch (err) {
            console.error("Failed tracking download", err);
        }
        // Open the file after tracking
        window.open(fileUrl, "_blank");
    };

    return (
        <div className="space-y-6">
            <AIChatModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                resourceTitle={title}
                resourceType={type}
            />
            {fileUrl && (
                <ResourceViewerModal
                    isOpen={isViewerOpen}
                    onClose={() => setIsViewerOpen(false)}
                    fileUrl={fileUrl}
                    title={title}
                />
            )}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center">
                        <h1 className="text-lg md:text-2xl font-bold text-[#0A251D] leading-tight">
                            {title}
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm mt-1">
                        <div
                            className="flex"
                            // star markup can be updated client-side after hydration (live stats);
                            // suppressHydrationWarning prevents dev-mode hydration error while keeping markup accessible
                            suppressHydrationWarning
                        >
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 fill-current ${
                                        star <=
                                        Math.round(stats?.rating ?? rating)
                                            ? "text-yellow-400"
                                            : "text-gray-200"
                                    }`}
                                    aria-hidden
                                />
                            ))}
                        </div>
                        <span className="text-gray-600 font-medium">
                            {(stats?.rating ?? rating).toFixed(1)} / 5
                        </span>
                        <span className="text-gray-400">
                            ({stats?.reviews ?? reviews} reviews)
                        </span>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1 text-gray-600">
                            <Download className="w-4 h-4" />
                            <span>
                                {stats?.downloads ?? downloads} downloads
                            </span>
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
