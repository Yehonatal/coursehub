import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourceCard } from "@/components/common/ResourceCard";

export function RelatedResources() {
    const relatedResources = [
        {
            id: 101,
            title: "Advanced Algorithms",
            rating: 4.8,
            reviews: 120,
            description:
                "Deep dive into graph algorithms, dynamic programming, and complexity analysis.",
            tags: ["CS301", "Algorithms"],
            downloads: 89,
            comments: 12,
            isVerified: true,
        },
        {
            id: 102,
            title: "System Design Patterns",
            rating: 4.9,
            reviews: 85,
            description:
                "Learn how to design scalable and maintainable software systems using common patterns.",
            tags: ["CS402", "Architecture"],
            downloads: 150,
            comments: 24,
            isAI: true,
        },
        {
            id: 103,
            title: "Cloud Computing Basics",
            rating: 4.6,
            reviews: 95,
            description:
                "Introduction to cloud services, deployment models, and virtualization technologies.",
            tags: ["CS405", "Cloud"],
            downloads: 210,
            comments: 18,
        },
    ];

    return (
        <div className="space-y-6 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0A251D]">
                    Recommended Resources
                </h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedResources.map((resource) => (
                    <ResourceCard
                        key={resource.id}
                        {...resource}
                        variant="mini"
                    />
                ))}
            </div>
        </div>
    );
}
