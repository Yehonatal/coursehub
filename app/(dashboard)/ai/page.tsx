"use client";

import React from "react";
import {
    Bot,
    Command,
    MessageCircle,
    Shield,
    Sparkles,
    Wand2,
    Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelCard } from "@/components/ai/ModelCard";
import { ActionCard } from "@/components/ai/ActionCard";
import { PromptBar } from "@/components/ai/PromptBar";

export default function AIPage() {
    return (
        <div className="min-h-screen rounded-t-xl bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.08),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.1),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(56,189,248,0.08),transparent_35%)] flex flex-col">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col gap-8 sm:gap-10 flex-1">
                <div className="text-center space-y-4 md:space-y-6">
                    <div className="flex items-center justify-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-secondary/80 border border-border/50 text-xs font-medium text-secondary-foreground flex items-center gap-2">
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                            Google AI Studio
                        </span>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-[2.1rem] sm:text-4xl md:text-6xl font-serif font-medium tracking-tight text-foreground">
                            CourseHub <span className="text-primary">AI</span>
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
                            Next-gen models to summarize, reason, and co-create
                            for your courses—built to feel calm and fast on
                            every screen.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button className="gap-2" size="sm">
                            <Sparkles className="h-4 w-4" /> Start a new chat
                        </Button>
                        <Button variant="outline" className="gap-2" size="sm">
                            <Command className="h-4 w-4" /> Quick shortcuts
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ModelCard
                        title="Gemini 2.5 Pro"
                        status="Active"
                        description="Best for deep reasoning, multimodal context, and complex course work."
                        icon={Bot}
                        accent="from-blue-500/20 to-purple-500/20"
                    />
                    <ModelCard
                        title="Gemini 2.5 Flash"
                        status="Coming Soon"
                        description="Fast, lightweight runs for quick answers and batch tasks."
                        icon={Zap}
                        accent="from-amber-400/25 to-orange-500/25"
                        disabled
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    <ActionCard
                        icon={Wand2}
                        title="Generate study summary"
                        description="Drop notes or slides—get concise recaps and key takeaways."
                    />
                    <ActionCard
                        icon={Shield}
                        title="Cite + verify"
                        description="Link sources and get inline citations for academic integrity."
                    />
                    <ActionCard
                        icon={MessageCircle}
                        title="Explain step-by-step"
                        description="Turn problem sets into guided walkthroughs with hints."
                    />
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 pt-3 sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] md:bottom-0 z-30 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-md border-t border-border/60">
                <div className="max-w-6xl mx-auto">
                    <PromptBar />
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground pb-24 sm:pb-12">
                <span className="hover:text-foreground cursor-pointer transition-colors">
                    Privacy Policy
                </span>
                <span className="hover:text-foreground cursor-pointer transition-colors">
                    Terms of Service
                </span>
            </div>
        </div>
    );
}
