"use client";

import { BookOpen, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

interface StudyGuideTabProps {
    guides: any[];
    viewingGuide: any | null;
    setViewingGuide: (guide: any | null) => void;
    studyGuideDetail: "simple" | "detailed";
    setStudyGuideDetail: (detail: "simple" | "detailed") => void;
    isGenerating: boolean;
    onGenerate: () => void;
}

export function StudyGuideTab({
    guides,
    viewingGuide,
    setViewingGuide,
    studyGuideDetail,
    setStudyGuideDetail,
    isGenerating,
    onGenerate,
}: StudyGuideTabProps) {
    if (viewingGuide) {
        return (
            <div className="flex flex-col h-full bg-background">
                <div className="p-4 border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-10 flex items-center gap-3">
                    <button
                        onClick={() => setViewingGuide(null)}
                        className="p-1 hover:bg-muted rounded-md transition-colors"
                    >
                        <ChevronRight className="rotate-180 w-5 h-5 text-muted-foreground" />
                    </button>
                    <h3 className="font-semibold text-sm truncate">
                        {viewingGuide.title}
                    </h3>
                </div>
                <div className="p-6 prose dark:prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{viewingGuide.content}</ReactMarkdown>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-muted/30 p-8">
            <div className="space-y-8">
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h3 className="font-semibold text-foreground text-base mb-1">
                                Create Study Guide
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Create a comprehensive summary of your
                                materials.
                            </p>
                        </div>
                        <Button
                            onClick={onGenerate}
                            disabled={isGenerating}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 h-auto text-sm font-medium rounded-lg"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                                    Generating...
                                </>
                            ) : (
                                "Generate"
                            )}
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Detail Level
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setStudyGuideDetail("simple")}
                                className={`py-3 px-4 text-sm font-medium rounded-lg border transition-all text-center ${
                                    studyGuideDetail === "simple"
                                        ? "bg-muted border-border text-foreground shadow-sm"
                                        : "bg-card border-border text-muted-foreground hover:border-sidebar-primary/50"
                                }`}
                            >
                                Simple
                                <span className="block text-[10px] font-normal text-muted-foreground mt-0.5">
                                    Quick overview
                                </span>
                            </button>
                            <button
                                onClick={() => setStudyGuideDetail("detailed")}
                                className={`py-3 px-4 text-sm font-medium rounded-lg border transition-all text-center ${
                                    studyGuideDetail === "detailed"
                                        ? "bg-muted border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-blue-500/20"
                                        : "bg-card border-border text-muted-foreground hover:border-sidebar-primary/50"
                                }`}
                            >
                                Detailed
                                <span className="block text-[10px] font-normal text-muted-foreground mt-0.5">
                                    Comprehensive
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {guides.length > 0 && (
                    <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">
                            Recent Guides
                        </h4>
                        <div className="space-y-3">
                            {guides.map((guide) => (
                                <div
                                    key={guide.id}
                                    onClick={() => setViewingGuide(guide)}
                                    className="group bg-card border border-border rounded-xl p-4 hover:border-blue-500/30 hover:shadow-sm cursor-pointer transition-all flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                                        <BookOpen size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm text-foreground mb-1">
                                            {guide.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>
                                                {new Date(
                                                    guide.date,
                                                ).toLocaleDateString()}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {guide.sections} sections
                                            </span>
                                            <span className="capitalize px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px]">
                                                {guide.detail}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
