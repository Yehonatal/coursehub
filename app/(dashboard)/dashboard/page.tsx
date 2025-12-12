import React from "react";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { RecentsList } from "@/components/dashboard/RecentsList";
import { ResourceGrid } from "@/components/dashboard/ResourceGrid";
import { AIUploadCard } from "@/components/dashboard/AIUploadCard";
import { MobileQuickActions } from "@/components/dashboard/MobileQuickActions";
import { mockDelay } from "@/utils/helpers";
import { DashboardToast } from "@/components/dashboard/DashboardToast";

export default async function StudentDashboard() {
    await mockDelay();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8">
            <DashboardToast />
            <div className="space-y-10">
                <MobileQuickActions />
                <RecentsList
                    items={[
                        {
                            title: "Project Management",
                            type: "Note",
                            meta: "45 min read",
                            author: "Yonatan .A",
                            iconType: "note",
                        },
                        {
                            title: "Object Oriented Systems Analysis and Design",
                            type: "Knowledge Tree",
                            meta: "20 Terms",
                            author: "Yonatan .A",
                            iconType: "tree",
                        },
                        {
                            title: "Advanced Database systems",
                            type: "Questions",
                            meta: "35 questions",
                            author: "Yonatan .A",
                            iconType: "question",
                        },
                    ]}
                />

                <ResourceGrid
                    title="Recommended for You"
                    viewAllLink="/resources"
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
                            title: "Data Structures and Algorithms",
                            rating: 4.9,
                            reviews: 342,
                            description:
                                "In-depth guide to common data structures and algorithms with examples in C++.",
                            tags: ["CS201", "HRU", "Notes"],
                            downloads: 256,
                            comments: 42,
                        },
                        {
                            id: 3,
                            title: "Database Management Systems",
                            rating: 4.5,
                            reviews: 156,
                            description:
                                "Complete course material for DBMS including SQL queries and normalization.",
                            tags: ["CS301", "HRU", "Exam"],
                            downloads: 189,
                            comments: 18,
                            isAI: true,
                        },
                        {
                            id: 4,
                            title: "Web Programming",
                            rating: 4.8,
                            reviews: 275,
                            description:
                                "Modern web development techniques using React, Node.js, and Tailwind CSS.",
                            tags: ["CS401", "HRU", "Project"],
                            downloads: 312,
                            comments: 56,
                        },
                        {
                            id: 5,
                            title: "Artificial Intelligence Fundamentals",
                            rating: 4.9,
                            reviews: 420,
                            description:
                                "Comprehensive introduction to AI concepts, machine learning, and neural networks.",
                            tags: ["CS501", "AI", "ML"],
                            downloads: 567,
                            comments: 89,
                            isAI: true,
                        },
                        {
                            id: 6,
                            title: "Computer Networks",
                            rating: 4.6,
                            reviews: 180,
                            description:
                                "Understanding the OSI model, TCP/IP protocols, and network security basics.",
                            tags: ["CS305", "Networking", "Cisco"],
                            downloads: 234,
                            comments: 34,
                        },
                    ]}
                />
            </div>

            <div className="hidden lg:block space-y-6">
                <AIUploadCard />
            </div>
        </div>
    );
}
