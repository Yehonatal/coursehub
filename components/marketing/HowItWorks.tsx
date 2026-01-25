import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Zap } from "lucide-react";

export function HowItWorks() {
    return (
        <section className="w-full py-12 sm:py-16 md:py-20 lg:py-32 bg-muted/50">
            <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
                <div className="text-center mb-12 sm:mb-16" data-aos="fade-up">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-tight mb-3 sm:mb-4">
                        How CourseHub works with your studies
                    </h2>
                </div>

                <div className="grid gap-8 sm:gap-10 md:gap-12 md:grid-cols-3 relative">
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-border border-t border-dashed border-muted-foreground/30 z-0"></div>

                    <div
                        className="flex flex-col items-center text-center relative z-10"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        <div className="flex h-20 sm:h-24 w-20 sm:w-24 items-center justify-center rounded-full bg-card border border-border shadow-sm mb-4 sm:mb-6">
                            <BookOpen
                                className="h-8 sm:h-10 w-8 sm:w-10 text-primary"
                                strokeWidth={1.5}
                            />
                        </div>
                        <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider mb-2 sm:mb-3">
                            Step 01
                        </div>
                        <h3 className="text-lg sm:text-xl font-serif font-bold mb-2 sm:mb-3">
                            Discover & Connect
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xs">
                            Find curriculum-aligned resources and see what your peers are studying in the global campus feed.
                        </p>
                    </div>

                    <div
                        className="flex flex-col items-center text-center relative z-10"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <div className="flex h-20 sm:h-24 w-20 sm:w-24 items-center justify-center rounded-full bg-card border border-border shadow-sm mb-4 sm:mb-6">
                            <Users
                                className="h-8 sm:h-10 w-8 sm:w-10 text-primary"
                                strokeWidth={1.5}
                            />
                        </div>
                        <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider mb-2 sm:mb-3">
                            Step 02
                        </div>
                        <h3 className="text-lg sm:text-xl font-serif font-bold mb-2 sm:mb-3">
                            Switch to Focus
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xs">
                            Toggle "Focus Mode" to enter your distraction-free workspace. Manage tasks, calendar, and classes in one place.
                        </p>
                    </div>

                    <div
                        className="flex flex-col items-center text-center relative z-10"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    >
                        <div className="flex h-20 sm:h-24 w-20 sm:w-24 items-center justify-center rounded-full bg-card border border-border shadow-sm mb-4 sm:mb-6">
                            <Zap
                                className="h-8 sm:h-10 w-8 sm:w-10 text-primary"
                                strokeWidth={1.5}
                            />
                        </div>
                        <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider mb-2 sm:mb-3">
                            Step 03
                        </div>
                        <h3 className="text-lg sm:text-xl font-serif font-bold mb-2 sm:mb-3">
                            Master with AI
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xs">
                            Use the AI companion to generate summaries and flashcards directly from your documents while tracking your study streaks.
                        </p>
                    </div>
                </div>

                <div className="mt-12 sm:mt-16 text-center">
                    <Link href="/features">
                        <Button
                            variant="outline"
                            className="rounded-full px-6 sm:px-8 h-10 sm:h-auto text-sm sm:text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                            Explore all features
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
