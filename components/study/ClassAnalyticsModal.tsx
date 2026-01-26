"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    BarChart3,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Flame,
    Folder,
    HelpCircle,
    Layers,
    PieChart,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface ClassAnalyticsModalProps {
    children: React.ReactNode;
    classNameName?: string; // Class Name
}

export function ClassAnalyticsModal({
    children,
    classNameName = "Test Class 1",
}: ClassAnalyticsModalProps) {
    // Mock Data
    const stats = {
        progress: 35,
        timeSpent: "12h 45m",
        streak: 5,
        upcomingEvents: 3,
        resources: {
            total: 12,
            breakdown: [
                { type: "PDF", count: 5, size: "12.5 MB" },
                { type: "Docs", count: 3, size: "4.2 MB" },
                { type: "Images", count: 2, size: "8.1 MB" },
                { type: "Quizzes", count: 2, size: "-" },
            ],
        },
        performance: {
            quizAverage: 82, // percentage
            questionsCorrect: 124,
            questionsTotal: 150,
            flashcardMastery: "High",
            flashcardReviewNeeded: 12,
        },
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[700px] bg-background p-0 overflow-hidden gap-0">
                <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30">
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <BarChart3 className="w-5 h-5 text-muted-foreground" />
                        <span className="font-semibold text-foreground">
                            {classNameName} Analytics
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 overflow-y-auto max-h-[80vh] bg-background">
                    {/* Top Row: Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center text-center">
                            <div className="relative w-12 h-12 mb-2 flex items-center justify-center">
                                <svg
                                    className="transform -rotate-90 w-full h-full"
                                    viewBox="0 0 40 40"
                                >
                                    <circle
                                        cx="20"
                                        cy="20"
                                        r="16"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        fill="transparent"
                                        className="text-muted"
                                    />
                                    <circle
                                        cx="20"
                                        cy="20"
                                        r="16"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        fill="transparent"
                                        strokeDasharray="100.5"
                                        strokeDashoffset={`${100.5 - (100.5 * stats.progress) / 100}`}
                                        strokeLinecap="round"
                                        className="text-green-500"
                                    />
                                </svg>
                                <span className="absolute text-xs font-bold text-foreground">
                                    {stats.progress}%
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground font-medium">
                                Class Completion
                            </span>
                        </div>

                        <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 flex items-center justify-center mb-2">
                                <Flame className="w-5 h-5 fill-current" />
                            </div>
                            <span className="text-lg font-bold text-foreground">
                                {stats.streak} Days
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                                Study Streak
                            </span>
                        </div>

                        <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 flex items-center justify-center mb-2">
                                <Clock className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-bold text-foreground">
                                {stats.timeSpent}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                                Total Time
                            </span>
                        </div>

                        <div className="bg-card border border-border p-4 rounded-xl flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 flex items-center justify-center mb-2">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-bold text-foreground">
                                {stats.upcomingEvents}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                                Upcoming Events
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Resource Breakdown */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Folder className="w-4 h-4 text-muted-foreground" />
                                Resource Breakdown
                            </h3>
                            <div className="border border-border rounded-xl p-4 bg-card shadow-sm">
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                                    <span className="text-muted-foreground text-sm">
                                        Total Resources
                                    </span>
                                    <span className="text-foreground font-bold">
                                        {stats.resources.total}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {stats.resources.breakdown.map(
                                        (item, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between text-sm"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                                                    <span className="text-muted-foreground">
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-foreground font-medium">
                                                        {item.count}
                                                    </span>
                                                    <span className="text-muted-foreground text-xs w-12 text-right">
                                                        {item.size}
                                                    </span>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Performance & Mastery */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <PieChart className="w-4 h-4 text-muted-foreground" />
                                Performance & Mastery
                            </h3>
                            <div className="border border-border rounded-xl p-4 bg-card shadow-sm space-y-4">
                                {/* Quiz Stats */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-muted-foreground text-sm flex items-center gap-1.5">
                                            <HelpCircle className="w-3.5 h-3.5" />{" "}
                                            Quiz Accuracy
                                        </span>
                                        <span className="text-green-600 text-sm font-bold">
                                            {stats.performance.quizAverage}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 rounded-full"
                                            style={{
                                                width: `${stats.performance.quizAverage}%`,
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {stats.performance.questionsCorrect} of{" "}
                                        {stats.performance.questionsTotal}{" "}
                                        questions correct
                                    </p>
                                </div>

                                <div className="h-px bg-border" />

                                {/* Flashcard Stats */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-muted-foreground text-sm flex items-center gap-1.5">
                                            <Layers className="w-3.5 h-3.5" />{" "}
                                            Concept Mastery
                                        </span>
                                        <span className="text-blue-600 text-sm font-bold">
                                            {stats.performance.flashcardMastery}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-1">
                                        <div className="h-1.5 rounded-full bg-blue-500" />
                                        <div className="h-1.5 rounded-full bg-blue-500" />
                                        <div className="h-1.5 rounded-full bg-blue-500" />
                                        <div className="h-1.5 rounded-full bg-blue-200" />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {
                                            stats.performance
                                                .flashcardReviewNeeded
                                        }{" "}
                                        items need review
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
