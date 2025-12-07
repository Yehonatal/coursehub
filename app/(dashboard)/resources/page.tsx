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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
                {/* Sidebar Filters */}
                <aside className="hidden lg:block">
                    <FilterSidebar />
                </aside>

                {/* Main Content */}
                <div className="space-y-10">
                    <PopularResourcesList />

                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-[#0A251D]">
                            Resources
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
