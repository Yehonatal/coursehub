import React from "react";
import { ResourceCard } from "@/components/common/ResourceCard";

interface ResourceItem {
    id: number;
    title: string;
    rating: number;
    reviews: number;
    description: string;
    tags: string[];
    downloads: number;
    comments: number;
    isAI?: boolean;
    isVerified?: boolean;
}

interface ResourceGridProps {
    resources: ResourceItem[];
}

export function MiniResourceGrid({ resources }: ResourceGridProps) {
    return (
        <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            data-aos="fade-up"
            data-aos-delay="300"
            suppressHydrationWarning
        >
            {resources.map((item, i) => (
                <ResourceCard key={i} {...item} variant="mini" />
            ))}
        </div>
    );
}
