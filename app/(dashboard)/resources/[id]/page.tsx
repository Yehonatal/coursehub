import React from "react";
import Image from "next/image";
import { ResourceHeader } from "@/components/resources/ResourceHeader";
import { ResourceContent } from "@/components/resources/ResourceContent";
import { ResourceSidebar } from "@/components/resources/ResourceSidebar";
import { RelatedResources } from "@/components/resources/RelatedResources";
import { CommentsSection } from "@/components/common/CommentsSection";
import { mockDelay } from "@/utils/helpers";

const dummyComments = [
    {
        id: "1",
        author: {
            name: "Yonatan . A",
        },
        content:
            "I'm a bit unclear about the third chapter on the slides, can someone give me a hand on the material?",
        timestamp: "50 minutes ago",
        likes: 15,
        dislikes: 0,
        replies: [
            {
                id: "2",
                author: {
                    name: "Someone .B",
                },
                content:
                    "Check in my profile I have posted a note on the same topic a while back.",
                timestamp: "30 minutes ago",
                likes: 2,
                dislikes: 0,
            },
            {
                id: "3",
                author: {
                    name: "Yonatan . A",
                },
                content: "Thanks, found it :)",
                timestamp: "14 minutes ago",
                likes: 1,
                dislikes: 0,
            },
        ],
    },
    {
        id: "4",
        author: {
            name: "Someone .C",
        },
        content: "This material is really good can you post more ?",
        timestamp: "1 hour ago",
        likes: 2,
        dislikes: 0,
    },
];

export default async function ResourcePage() {
    await mockDelay();

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <div className="w-full border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="h-32 sm:h-48 w-full rounded-t-xl bg-white border border-border/60 relative overflow-hidden group">
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-50 to-emerald-50">
                            <div className="flex items-center gap-4 opacity-80">
                                <div className="relative h-16 w-16">
                                    <Image
                                        src="/hu-logo.jpg"
                                        alt="Haramaya University"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-3xl font-serif font-bold text-green-700">
                                        Haramaya University
                                    </h1>
                                    <p className="text-sm text-orange-400 font-medium italic">
                                        — Building the Basis for Development —
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8 order-1 lg:order-1">
                        <ResourceHeader
                            title="Data Structures and Algorithms"
                            rating={4.5}
                            reviews={120}
                            downloads={1050}
                            courseCode="CS201"
                            type="Lecture Slides"
                            date="March 10, 2025"
                            author="Dr. Alan Turing"
                            university="Haramaya University"
                            department="Software Engineering"
                        />

                        <ResourceContent
                            description="This comprehensive course on Data Structures and Algorithms provides a deep dive into the fundamental building blocks of efficient software design. Starting with basic structures like arrays and linked lists, the course progresses to complex trees, graphs, and advanced algorithm design techniques. Students will learn how to analyze the time and space complexity of algorithms using Big O notation, ensuring they can select the most appropriate tools for solving real-world computational problems."
                            studyTime="Approximately 12 hours"
                            objectives={[
                                "Master fundamental data structures including stacks, queues, and hash tables.",
                                "Analyze algorithm efficiency using Big O notation.",
                                "Implement and optimize sorting and searching algorithms.",
                                "Apply graph theory to solve network and pathfinding problems.",
                                "Understand dynamic programming and greedy algorithms.",
                            ]}
                        />

                        <RelatedResources />
                    </div>
                    <div className="lg:col-span-4 order-2 lg:order-2">
                        <ResourceSidebar />
                    </div>

                    {/* Ensure comments are always last on small screens and below main content on large screens */}
                    <div className="lg:col-span-8 order-3 lg:order-3">
                        <CommentsSection
                            comments={dummyComments}
                            totalCount={dummyComments.length}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
