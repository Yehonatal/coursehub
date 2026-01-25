"use client";

import React from "react";
import {
    Mic,
    BookOpen,
    Layers,
    FileQuestion,
    Upload,
    CornerDownLeft,
    Plus,
    Folder,
    Link as LinkIcon,
    X,
} from "lucide-react";
import { FocusTimer } from "@/components/study/FocusTimer";
import { useUser } from "@/components/providers/UserProvider";
import Link from "next/link";
import { cn } from "@/utils/cn";

import { CreateClassModal } from "@/components/study/CreateClassModal";

export default function StudyDashboard() {
    const { user } = useUser();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    const quickActions = [
        {
            label: "Study plan",
            icon: FileQuestion,
            color: "text-blue-500",
            href: "/study/planner",
        },
        {
            label: "Flashcards",
            icon: Layers,
            color: "text-cyan-500",
            href: "/study/library?type=flashcards",
        },
        {
            label: "Study guide",
            icon: BookOpen,
            color: "text-green-500",
            href: "/study/library?type=guide",
        },
        {
            label: "Quiz",
            icon: FileQuestion,
            color: "text-orange-500",
            href: "/study/library?type=quiz",
        },
        {
            label: "Record lecture",
            icon: Mic,
            color: "text-red-500",
            href: "#",
        }, // Placeholder
    ];

    const [isLinkMode, setIsLinkMode] = React.useState(false);

    return (
        <div className="flex flex-col h-full bg-background/50 relative">
            <div className="absolute top-6 right-8 z-10">
                <FocusTimer />
            </div>

            <div className="flex-1 flex flex-col items-center pt-20 px-8 max-w-7xl mx-auto w-full space-y-8">
                <div className="text-center space-y-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                        {getGreeting()}, {user?.first_name || "Scholar"}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {quickActions.map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className="flex items-center gap-2 px-4 py-2 bg-background border border-border/60 hover:border-primary/40 rounded-full shadow-sm hover:shadow-md transition-all group"
                            >
                                <action.icon
                                    className={cn("w-4 h-4", action.color)}
                                />
                                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                                    {action.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                    <div className="bg-background border border-border/60 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all overflow-hidden group focus-within:ring-2 focus-within:ring-primary/10">
                        {isLinkMode ? (
                            <div className="p-2 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="h-10 w-10 text-primary bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                    <LinkIcon className="w-5 h-5" />
                                </div>
                                <input
                                    autoFocus
                                    className="flex-1 bg-transparent border-none outline-none h-10 px-2 text-sm"
                                    placeholder="Paste a YouTube or website link..."
                                />
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium rounded-lg transition-colors">
                                        Add
                                    </button>
                                    <button
                                        onClick={() => setIsLinkMode(false)}
                                        className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <textarea
                                    placeholder="Upload materials here or ask CourseHub anything..."
                                    className="w-full bg-transparent border-none outline-none p-5 text-lg resize-none min-h-[60px] focus:ring-0 placeholder:text-muted-foreground/50"
                                    rows={1}
                                />
                                <div className="flex items-center justify-between px-4 pb-3">
                                    <div className="flex gap-2">
                                        <button
                                            className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                                            title="Upload files"
                                        >
                                            <Upload className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setIsLinkMode(true)}
                                            className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                                            title="Add link"
                                        >
                                            <LinkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 text-xs font-medium text-muted-foreground">
                                            <span>Gemini 2.0 Flash</span>
                                        </div>
                                        <button className="h-8 w-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50">
                                            <CornerDownLeft className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className=" w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-card border border-border/50 rounded-xl hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer group flex items-start gap-4">
                        <div className="h-10 w-10 bg-blue-500/10 text-blue-600 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                Chapter 2: SCRUM Team
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                                Software Engineering • 2h ago
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-5xl space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 pb-10">
                    <div className="flex items-center justify-between px-1">
                        <div className="text-sm font-medium text-muted-foreground">
                            My Classes
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <CreateClassModal>
                            <button className="w-full aspect-video rounded-xl border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group text-muted-foreground hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary">
                                <div className="h-8 w-8 rounded-full bg-muted group-hover:bg-background flex items-center justify-center transition-colors">
                                    <Plus className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-medium">
                                    New class
                                </span>
                            </button>
                        </CreateClassModal>

                        <div className="aspect-video rounded-xl bg-card border border-border/50 p-4 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />
                            <Folder className="w-8 h-8 text-green-500/20 group-hover:text-green-500 transition-colors" />
                            <div>
                                <h3 className="font-medium text-sm truncate">
                                    Software Engineering
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    0 resources
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
