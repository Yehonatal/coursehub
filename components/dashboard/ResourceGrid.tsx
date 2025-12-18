import React from "react";
import { ResourceCard } from "@/components/common/ResourceCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ResourceItem {
    id: string | number;
    title: string;
    rating: number;
    reviews: number;
    description: string;
    tags: string[];
    downloads: number;
    comments: number;
    isAI?: boolean;
    isVerified?: boolean;
    verifier?: {
        name: string;
        date: string;
    };
    fileUrl?: string;
    mimeType?: string;
}

interface ResourceGridProps {
    resources: ResourceItem[];
    title?: string;
    viewAllLink?: string;
}

export function ResourceGrid({
    resources,
    title = "Most Popular Resources",
    viewAllLink,
}: ResourceGridProps) {
    return (
        <div data-aos="fade-up" data-aos-delay="300" suppressHydrationWarning>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif font-bold text-foreground">
                    {title}
                </h3>
                {viewAllLink && (
                    <Link
                        href={viewAllLink}
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                    >
                        View All <ArrowRight className="h-4 w-4" />
                    </Link>
                )}
            </div>
            <div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                data-aos="fade-up"
                data-aos-delay="300"
                suppressHydrationWarning
            >
                {resources.map((item, i) => (
                    <ResourceCard key={i} {...item} />
                ))}
            </div>
        </div>
    );
}
