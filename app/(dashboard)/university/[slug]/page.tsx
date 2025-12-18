import React from "react";
import { UniversityHeader } from "@/components/dashboard/UniversityHeader";
import { UniversityStats } from "@/components/dashboard/UniversityStats";
import { UniversityCommunity } from "@/components/dashboard/UniversityCommunity";
import { ResourceCard } from "@/components/common/ResourceCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function UniversityPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // Hardcoded resources for university page
    const resources = [
        {
            id: "1",
            title: "Introduction to Software Engineering",
            rating: 4.7,
            reviews: 210,
            description:
                "This set of lecture slides provides a comprehensive overview of the fundamental...",
            tags: ["CS101", "HRU", "Slides"],
            downloads: 148,
            comments: 25,
            isAI: true,
            isVerified: true,
        },
        {
            id: "2",
            title: "Advanced Database Systems",
            rating: 4.9,
            reviews: 156,
            description:
                "Deep dive into query optimization, indexing strategies, and distributed databases.",
            tags: ["CS302", "DB", "Notes"],
            downloads: 89,
            comments: 12,
            isAI: false,
            isVerified: true,
        },
        {
            id: "3",
            title: "Computer Networks Fundamentals",
            rating: 4.5,
            reviews: 98,
            description:
                "Complete guide to OSI model, TCP/IP protocols, and network security basics.",
            tags: ["CS205", "Networking", "Guide"],
            downloads: 234,
            comments: 45,
            isAI: false,
            isVerified: false,
        },
        {
            id: "4",
            title: "Operating Systems Concepts",
            rating: 4.8,
            reviews: 187,
            description:
                "Detailed notes on process management, memory allocation, and file systems.",
            tags: ["CS202", "OS", "Slides"],
            downloads: 167,
            comments: 31,
            isAI: true,
            isVerified: true,
        },
    ];

    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="space-y-16">
                <UniversityHeader
                    name="Haramaya University"
                    description="Haramaya University is a public research university in Haramaya, Oromia Region, Ethiopia."
                    type="Public University"
                    website="https://www.haramaya.edu.et/"
                    logoUrl="/hu-logo.jpg"
                />

                {/* Community & Impact Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-8">
                        <UniversityStats />
                    </div>
                    <div className="lg:col-span-4 pt-4">
                        <UniversityCommunity />
                    </div>
                </div>

                {/* Materials Section */}
                <div className="space-y-16">
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                                    Curated
                                </p>
                                <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary">
                                    Top Verified Materials
                                </h3>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-12 w-12 rounded-2xl border-border/40 text-primary hover:bg-primary/5 transition-all"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-12 w-12 rounded-2xl border-border/40 text-primary hover:bg-primary/5 transition-all"
                                >
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {resources.map((resource) => (
                                <ResourceCard key={resource.id} {...resource} />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                                Latest
                            </p>
                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary">
                                Recent Contributions
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {resources.slice(0, 4).map((resource) => (
                                <ResourceCard key={resource.id} {...resource} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
