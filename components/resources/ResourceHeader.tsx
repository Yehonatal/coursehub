"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, BadgeCheck, Clock } from "lucide-react";
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
    isOwner?: boolean;
    isVerified?: boolean;
    verifier?: {
        name: string;
        date: string;
    };
    resourceData?: {
        courseCode: string;
        semester: string;
        university: string;
        type: string;
        description?: string;
        tags?: string;
        fileUrl?: string;
        fileName?: string;
    };
    studyTime?: string;
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
    isOwner = false,
    isVerified = false,
    verifier,
    resourceData,
    studyTime,
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
        <div className="space-y-4">
            <AIChatModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                resourceTitle={title}
                resourceType={type}
                fileUrl={fileUrl}
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

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="primary" className="px-2 py-0.5">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="px-2 py-0.5">
                            {courseCode}
                        </Badge>
                        {isVerified ? (
                            <div className="group relative inline-block">
                                <Badge
                                    variant="verified"
                                    className="px-2 py-0.5"
                                />
                                {verifier && (
                                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 p-3 bg-card border border-border rounded-2xl shadow-2xl z-50 text-[10px] animate-in fade-in slide-in-from-bottom-1 duration-200">
                                        <div className="space-y-1">
                                            <p className="font-bold text-primary flex items-center gap-1.5">
                                                <BadgeCheck className="h-3 w-3 text-blue-500" />
                                                Verified Educator
                                            </p>
                                            <p className="text-muted-foreground font-medium">
                                                {verifier.name}
                                            </p>
                                            <p className="text-muted-foreground/50 text-[9px]">
                                                {new Date(
                                                    verifier.date
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    }
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Badge variant="neutral" className="px-2 py-0.5">
                                Unverified
                            </Badge>
                        )}
                    </div>

                    <h1 className="text-xl md:text-2xl font-serif font-bold text-foreground tracking-tight leading-tight">
                        {title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] md:text-xs">
                        <div className="flex items-center gap-1.5">
                            <StarRating
                                value={userRating ?? displayRating}
                                onChange={submitRating}
                                readOnly={ratingLoading}
                                size="md"
                            />
                            <div className="flex items-center gap-1">
                                <span className="text-primary font-bold">
                                    {displayRating.toFixed(1)}
                                </span>
                                <span className="text-muted-foreground/60 font-medium">
                                    ({displayCount})
                                </span>
                            </div>
                        </div>
                        <div className="h-3 w-px bg-border hidden sm:block" />
                        <div className="flex items-center gap-1.5 text-muted-foreground/70 font-medium">
                            <Download className="w-3 h-3" />
                            <span>{displayDownloads}</span>
                        </div>
                        <div className="h-3 w-px bg-border hidden sm:block" />
                        {studyTime && (
                            <div className="flex items-center gap-1.5 text-muted-foreground/70 font-medium">
                                <Clock className="w-3 h-3" />
                                <span>{studyTime}</span>
                            </div>
                        )}
                        <div className="h-3 w-px bg-border hidden sm:block" />
                        <div className="text-muted-foreground/70 font-medium">
                            {date}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[9px]">
                            {author.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="text-[10px] md:text-xs">
                            <span className="text-muted-foreground">By </span>
                            <span className="font-bold text-primary">
                                {author}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block shrink-0">
                    {university && (
                        <Link
                            href={`/university/${university
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, "")}`}
                            className="flex items-center gap-2.5 p-2 rounded-xl bg-card border border-border hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 group"
                        >
                            <UniversityBadge
                                university={university}
                                size={32}
                            />
                            <div className="space-y-0">
                                <p className="text-xs font-serif font-bold text-foreground group-hover:text-primary transition-colors">
                                    {university}
                                </p>
                                <p className="text-[9px] text-muted-foreground/60 font-medium">
                                    {department || "Academic Department"}
                                </p>
                            </div>
                        </Link>
                    )}
                </div>
            </div>

            <ResourceHeaderActions
                onGenerateContent={() => setIsAIModalOpen(true)}
                onView={fileUrl ? () => setIsViewerOpen(true) : undefined}
                onDownload={fileUrl ? handleDownload : undefined}
                resourceId={resourceId || ""}
                title={title}
                isOwner={isOwner}
                isVerified={isVerified}
                resourceData={resourceData}
            />
        </div>
    );
}
