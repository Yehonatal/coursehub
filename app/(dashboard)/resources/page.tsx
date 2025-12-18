import React from "react";
import { FilterSidebar } from "@/components/resources/filters/FilterSidebar";
import { PopularResourcesList } from "@/components/resources/PopularResourcesList";
import { ResourceCard } from "@/components/common/ResourceCard";

export default function ResourcesPage() {
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
            isVerified: true,
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
            isAI: true,
            isVerified: true,
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
            isAI: true,
            isVerified: true,
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
            isVerified: true,
        },
        {
            id: 5,
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
            id: 6,
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
    ];

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
                        Explore Resources
                    </h1>
                    <p className="text-muted-foreground/70 font-medium">
                        Discover high-quality study materials shared by your
                        community.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
                {/* Sidebar Filters */}
                <aside className="hidden lg:block sticky top-24 self-start">
                    <FilterSidebar />
                </aside>

                {/* Main Content */}
                <div className="space-y-12">
                    <PopularResourcesList />

                    <div className="space-y-8">
                        <h3 className="text-xl font-serif font-bold text-primary">
                            All Resources
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {resources.map((resource) => (
                                <ResourceCard key={resource.id} {...resource} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
