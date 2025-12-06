import React from "react";
import { ProfileHeader } from "@/components/dashboard/ProfileHeader";
import { ProfileStats } from "@/components/dashboard/ProfileStats";
import { ProfileRecents } from "@/components/dashboard/ProfileRecents";
import { MiniResourceGrid } from "@/components/dashboard/MiniResourceGrid";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockDelay } from "@/utils/helpers";

export default async function StudentProfilePage() {
    await mockDelay();

    return (
        <div className="max-w-7xl mx-auto pb-12 space-y-8 px-4 sm:px-6 lg:px-8">
            <ProfileHeader />
            <ProfileStats />
            <ProfileRecents />

            <div
                className="space-y-4"
                data-aos="fade-up"
                data-aos-delay="300"
                suppressHydrationWarning
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#0A251D]">
                        Most Popular Resources Posted
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
                <MiniResourceGrid
                    resources={[
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
                            title: "Advanced Database Systems",
                            rating: 4.9,
                            reviews: 180,
                            description:
                                "Deep dive into query optimization, indexing strategies, and distributed databases.",
                            tags: ["CS302", "DB", "Notes"],
                            downloads: 230,
                            comments: 42,
                        },
                        {
                            id: 3,
                            title: "Data Structures & Algorithms",
                            rating: 4.8,
                            reviews: 315,
                            description:
                                "Complete guide to trees, graphs, and dynamic programming with Python examples.",
                            tags: ["CS201", "DSA", "Code"],
                            downloads: 512,
                            comments: 89,
                            isAI: true,
                        },
                        {
                            id: 4,
                            title: "Web Development Fundamentals",
                            rating: 4.6,
                            reviews: 150,
                            description:
                                "Modern web development concepts including React, Next.js, and Tailwind CSS.",
                            tags: ["Web", "React", "Frontend"],
                            downloads: 190,
                            comments: 30,
                        },
                        {
                            id: 5,
                            title: "Operating Systems Concepts",
                            rating: 4.5,
                            reviews: 120,
                            description:
                                "Understanding processes, threads, scheduling, and memory management.",
                            tags: ["CS303", "OS", "Theory"],
                            downloads: 165,
                            comments: 22,
                        },
                    ]}
                />
            </div>
        </div>
    );
}
