import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Zap } from "lucide-react";

export function HowItWorks() {
    return (
        <section className="w-full py-20 md:py-32 bg-muted/30">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-3xl font-serif font-medium tracking-tight sm:text-4xl md:text-5xl mb-4">
                        How CourseHub works with your studies
                    </h2>
                </div>

                <div className="grid gap-12 md:grid-cols-3 relative">
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-border border-t border-dashed border-muted-foreground/30 z-0"></div>

                    <div
                        className="flex flex-col items-center text-center relative z-10"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-background border border-border shadow-sm mb-6">
                            <BookOpen
                                className="h-10 w-10 text-primary"
                                strokeWidth={1.5}
                            />
                        </div>
                        <div className="inline-block rounded-md bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wider mb-3">
                            Step 01
                        </div>
                        <h3 className="text-xl font-serif font-bold mb-3">
                            Centralize Resources
                        </h3>
                        <p className="text-muted-foreground leading-relaxed max-w-xs">
                            Upload and access educational resources like PDFs
                            and docs, strictly tagged by course code and
                            university for easy retrieval.
                        </p>
                    </div>

                    <div
                        className="flex flex-col items-center text-center relative z-10"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-background border border-border shadow-sm mb-6">
                            <Users
                                className="h-10 w-10 text-primary"
                                strokeWidth={1.5}
                            />
                        </div>
                        <div className="inline-block rounded-md bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wider mb-3">
                            Step 02
                        </div>
                        <h3 className="text-xl font-serif font-bold mb-3">
                            Community Moderation
                        </h3>
                        <p className="text-muted-foreground leading-relaxed max-w-xs">
                            Rate content, leave comments, and rely on educator
                            verification to ensure you are studying the best
                            material available.
                        </p>
                    </div>

                    <div
                        className="flex flex-col items-center text-center relative z-10"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    >
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-background border border-border shadow-sm mb-6">
                            <Zap
                                className="h-10 w-10 text-primary"
                                strokeWidth={1.5}
                            />
                        </div>
                        <div className="inline-block rounded-md bg-muted px-2 py-1 text-xs font-medium uppercase tracking-wider mb-3">
                            Step 03
                        </div>
                        <h3 className="text-xl font-serif font-bold mb-3">
                            AI Enhancement
                        </h3>
                        <p className="text-muted-foreground leading-relaxed max-w-xs">
                            Transform static documents into dynamic study aids
                            like flashcards and knowledge trees using our Gemini
                            Studio integration.
                        </p>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Link href="/features">
                        <Button
                            variant="outline"
                            className="rounded-full px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                            Explore all features
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
