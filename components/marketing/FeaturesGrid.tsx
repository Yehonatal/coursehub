import React from "react";
import {
    BookOpen,
    Shield,
    Zap,
    Users,
    Bell,
    BarChart,
    Calendar,
    Target,
} from "lucide-react";
import { HandDrawnUnderline } from "@/components/ui/decorations";

export function FeaturesGrid() {
    const features = [
        {
            icon: <Target className="h-6 w-6" />,
            title: "Focus Mode",
            desc: "A dedicated distraction-free workspace designed to help you enter flow state and master deep work.",
        },
        {
            icon: <Calendar className="h-6 w-6" />,
            title: "Smart Planner",
            desc: "Visualize your semester with Kanban boards and calendars linked directly to your courses.",
        },
        {
            icon: <Zap className="h-6 w-6" />,
            title: "AI Companion",
            desc: "Sidebar AI that knows your context—generate summaries and flashcards without leaving your document.",
        },
        {
            icon: <BookOpen className="h-6 w-6" />,
            title: "Structured Library",
            desc: "Resources are tagged by course code, semester, and university, making retrieval instant and precise.",
        },
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Verified Content",
            desc: "Educator-verified tags and community reporting ensure only the highest quality materials surface.",
        },
        {
            icon: <BarChart className="h-6 w-6" />,
            title: "Deep Analytics",
            desc: "Track more than just downloads—visualize your study streaks, time spent, and task completion rates.",
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Community Driven",
            desc: "Connect with peers, share resources, and build your academic reputation on the leaderboard.",
        },
        {
            icon: <Bell className="h-6 w-6" />,
            title: "Smart Alerts",
            desc: "Get notified about relevant new uploads, deadlienes, and interactions on your shared content.",
        },
    ];

    return (
        <section className="w-full py-12 sm:py-16 md:py-20 lg:py-32 bg-background">
            <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                    <div className="inline-block rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground uppercase tracking-wider mb-3 sm:mb-4">
                        Student Value
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-tight mb-3 sm:mb-4">
                        Key benefits for your academic journey
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Built for the specific rigors of higher education in
                        <HandDrawnUnderline className="text-primary">
                            Ethiopia.
                        </HandDrawnUnderline>
                    </p>
                </div>

                <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((item, i) => (
                        <div
                            key={i}
                            className="group p-4 sm:p-6 border border-border/50 hover:border-primary/30 bg-card hover:bg-secondary/20 transition-colors rounded-lg sm:rounded-xl"
                            data-aos="fade-up"
                            data-aos-delay={i * 50}
                        >
                            <div className="mb-3 sm:mb-4 text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                                {item.icon}
                            </div>
                            <h3 className="text-base sm:text-lg font-serif font-bold mb-1 sm:mb-2">
                                {item.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
