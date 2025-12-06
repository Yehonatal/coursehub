import React from "react";
import { UniversityHeader } from "@/components/dashboard/UniversityHeader";
import { UniversityStats } from "@/components/dashboard/UniversityStats";
import { UniversityCommunity } from "@/components/dashboard/UniversityCommunity";
import { MiniResourceGrid } from "@/components/dashboard/MiniResourceGrid";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockDelay } from "@/utils/helpers";

export default async function UniversityPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    await mockDelay();

    const resources = [
        {
            id: 1,
            title: "Introduction to Software Engineering",
            rating: 4.7,
            reviews: 210,
            description:
                "This set of lecture slides provides a comprehensive overview of the fundamental...",
            tags: ["CS101", "HRU", "Slides"],
            downloads: 148,
            comments: 25,
            isAI: true,
        },
        {
            id: 2,
            title: "Introduction to Software Engineering",
            rating: 4.7,
            reviews: 210,
            description:
                "This set of lecture slides provides a comprehensive overview of the fundamental...",
            tags: ["CS101", "HRU", "Slides"],
            downloads: 148,
            comments: 25,
            isAI: false,
        },
        {
            id: 3,
            title: "Introduction to Software Engineering",
            rating: 4.7,
            reviews: 210,
            description:
                "This set of lecture slides provides a comprehensive overview of the fundamental...",
            tags: ["CS101", "HRU", "Slides"],
            downloads: 148,
            comments: 25,
            isAI: false,
        },
        {
            id: 4,
            title: "Introduction to Software Engineering",
            rating: 4.7,
            reviews: 210,
            description:
                "This set of lecture slides provides a comprehensive overview of the fundamental...",
            tags: ["CS101", "HRU", "Slides"],
            downloads: 148,
            comments: 25,
            isAI: true,
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-16 sm:px-6 lg:px-8 pb-12">
            <div className="space-y-8">
                <UniversityHeader
                    name="Haramaya University"
                    description="Haramaya University is a public research university in Haramaya, Oromia Region, Ethiopia."
                    type="Public University"
                    website="https://www.haramaya.edu.et/"
                    logoUrl="/hu-logo.jpg"
                />

                <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] py-6 gap-8">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-4">
                            University's Community on The Platform
                        </h3>
                        <UniversityStats />
                    </div>
                    <UniversityCommunity />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#0A251D]">
                            Top verified Material
                        </h3>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border-[#0A251D]/20 text-[#0A251D]"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border-[#0A251D]/20 text-[#0A251D]"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <MiniResourceGrid resources={resources} />
                </div>
            </div>
        </div>
    );
}
