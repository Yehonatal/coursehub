"use client";

import Link from "next/link";
import {
    ChevronLeft,
    Folder,
    Search,
    ChevronDown,
    Plus,
    FileText,
    MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { ClassAnalyticsModal } from "@/components/study/ClassAnalyticsModal";

export default function ClassDetailsPage({
    params,
}: {
    params: { classId: string };
}) {
    const [activeTab, setActiveTab] = useState("resources");

    // Mock Data
    const className = "Fundamentals Of Software Engineering";
    const description =
        "I have a number of resources to prep for exit on this course, including notes, flashcards, and past papers. The course is a core course so I will also have like 3 courses attached to this course.";

    const resources = [
        {
            id: 1,
            title: "Lecture 1: Introduction",
            type: "pdf",
            date: "2 days ago",
        },
        {
            id: 2,
            title: "Midterm Review Guide",
            type: "doc",
            date: "5 days ago",
        },
        { id: 3, title: "Chapter 3 Quiz", type: "quiz", date: "1 week ago" },
    ];

    const files = [
        { id: 1, name: "Syllabus.pdf", size: "1.2 MB" },
        { id: 2, name: "Project_Specs.docx", size: "450 KB" },
    ];

    return (
        <div className="flex flex-col h-full bg-background min-h-screen p-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
                <Link
                    href="/study/dashboard"
                    className="hover:text-foreground transition-colors p-1 -ml-1 rounded-sm hover:bg-muted"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded flex items-center justify-center bg-primary/10 text-primary">
                        <Folder className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <span className="font-semibold text-foreground">
                        {className}
                    </span>
                </div>
            </div>

            <div className="mb-10 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-foreground mb-2 tracking-tight">
                        {className}
                    </h1>
                    <p className="text-muted-foreground w-3xl">{description}</p>
                </div>

                <ClassAnalyticsModal classNameName={className}>
                    <div className="bg-card rounded-lg py-2 px-4 border border-border flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors group">
                        <div>
                            <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-0.5 group-hover:text-foreground/70">
                                Class Progress
                            </div>
                            <div className="text-sm font-bold text-foreground">
                                35% Complete
                            </div>
                        </div>
                        <div className="w-10 h-10 relative">
                            <svg
                                className="w-full h-full transform -rotate-90"
                                viewBox="0 0 40 40"
                            >
                                <circle
                                    cx="20"
                                    cy="20"
                                    r="16"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    className="text-muted"
                                />
                                <circle
                                    cx="20"
                                    cy="20"
                                    r="16"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    strokeDasharray="100.5"
                                    strokeDashoffset="65.3"
                                    strokeLinecap="round"
                                    className="text-green-500"
                                />
                            </svg>
                        </div>
                    </div>
                </ClassAnalyticsModal>
            </div>

            <div className="flex items-end justify-between border-b border-border mb-8">
                <div className="flex items-center gap-8 -mb-px">
                    <button
                        onClick={() => setActiveTab("resources")}
                        className={cn(
                            "pb-4 text-sm font-medium transition-colors border-b-2",
                            activeTab === "resources"
                                ? "text-foreground border-foreground"
                                : "text-muted-foreground border-transparent hover:text-foreground hover:border-border",
                        )}
                    >
                        Study Resources
                    </button>
                    <button
                        onClick={() => setActiveTab("files")}
                        className={cn(
                            "pb-4 text-sm font-medium transition-colors border-b-2",
                            activeTab === "files"
                                ? "text-foreground border-foreground"
                                : "text-muted-foreground border-transparent hover:text-foreground hover:border-border",
                        )}
                    >
                        Files
                    </button>
                </div>

                <div className="flex items-center gap-3 pb-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search in class..."
                            className="w-full pl-9 pr-4 py-2 h-9 bg-muted/50 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground"
                        />
                    </div>

                    <button className="flex items-center gap-2 px-3 py-2 h-9 bg-card border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                        Sort: Newest first
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>

                    <button className="flex items-center gap-2 px-3 py-2 h-9 bg-card border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                        All types
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>

                    <button className="flex items-center gap-1.5 px-4 py-2 h-9 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-medium transition-colors shadow-sm ml-1">
                        <Plus className="w-4 h-4" />
                        Generate
                    </button>
                </div>
            </div>

            <div className="flex-1">
                {activeTab === "resources" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {resources.map((resource) => (
                            <div
                                key={resource.id}
                                className="p-4 border border-border rounded-xl hover:shadow-md hover:border-border/80 transition-all cursor-pointer bg-card group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <button className="text-muted-foreground hover:text-foreground">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                                <h3 className="font-medium text-foreground mb-1">
                                    {resource.title}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="capitalize bg-muted px-2 py-0.5 rounded-full">
                                        {resource.type}
                                    </span>
                                    <span>• {resource.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="border border-border rounded-xl overflow-hidden">
                        {files.map((file, i) => (
                            <div
                                key={file.id}
                                className={`flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors ${i !== files.length - 1 ? "border-b border-border" : ""}`}
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-sm font-medium text-foreground">
                                        {file.name}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {file.size}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {((activeTab === "resources" && resources.length === 0) ||
                    (activeTab === "files" && files.length === 0)) && (
                    <div className="flex flex-col items-center justify-center pt-20">
                        <div className="w-16 h-16 text-muted-foreground/40 mb-4">
                            <Folder
                                size={64}
                                strokeWidth={1.5}
                                className="text-muted-foreground/40"
                            />
                        </div>
                        <h3 className="text-muted-foreground text-sm font-medium mb-1">
                            No study resources in this class
                        </h3>
                        <p className="text-muted-foreground/70 text-xs">
                            Add resources to this class from the Library
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
