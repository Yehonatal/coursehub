"use client";

import React, { useState, useEffect } from "react";
import { ResourceHeader } from "@/components/resources/ResourceHeader";
import { ResourceContent } from "@/components/resources/ResourceContent";
import { ResourceSidebar } from "@/components/resources/ResourceSidebar";
import { RelatedResources } from "@/components/resources/RelatedResources";
import { CommentsSection } from "@/components/common/CommentsSection";
import { mockDelay } from "@/utils/helpers";
import {
    ResourceHeaderSkeleton,
    ResourceContentSkeleton,
    ResourceSidebarSkeleton,
    RelatedResourcesSkeleton,
    CommentsSectionSkeleton,
} from "@/components/skeleton/ResourcePageSkeleton";

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

export default function ResourcePage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            await mockDelay();
            setLoading(false);
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50/50 pb-20">
                <div className="w-full border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="w-full h-48 rounded-2xl bg-gray-200 animate-pulse" />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-8">
                            <ResourceHeaderSkeleton />
                            <ResourceContentSkeleton />
                            <RelatedResourcesSkeleton />
                            <CommentsSectionSkeleton />
                        </div>

                        <div className="lg:col-span-4">
                            <ResourceSidebarSkeleton />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <div className="w-full  border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="w-full h-auto py-8 md:h-48 rounded-2xl bg-linear-to-r from-green-50 to-emerald-50 border border-green-100 flex items-center justify-center relative overflow-hidden">
                        <div className="text-center z-10 px-4">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                                    <span className="text-2xl">🎓</span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-[#0A251D]">
                                    Haramaya University
                                </h1>
                            </div>
                            <p className="text-[#0A251D]/80 font-medium italic">
                                Building the Basis for Development
                            </p>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(#22c55e_1px,transparent_1px)] bg-size-[16px_16px]"></div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <ResourceHeader
                            title="Data Structures and Algorithms"
                            rating={4.5}
                            reviews={120}
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

                        <CommentsSection
                            comments={dummyComments}
                            totalCount={dummyComments.length}
                        />
                    </div>

                    <div className="lg:col-span-4">
                        <ResourceSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
}
