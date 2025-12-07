import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    HandDrawnCircle,
    HandDrawnUnderline,
} from "@/components/ui/decorations";
import { BookOpen } from "lucide-react";

export function Hero() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#F9F9F9]">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    <div className="space-y-8" data-aos="fade-right">
                        <h1 className="text-5xl font-serif font-medium tracking-tight sm:text-6xl md:text-7xl text-foreground leading-[1.1]">
                            A centralized,
                            <HandDrawnUnderline className="text-[#F5A623]">
                                adaptive
                            </HandDrawnUnderline>{" "}
                            learning ecosystem for{" "}
                            <HandDrawnCircle className="text-[#F5A623] -rotate-2">
                                everyone.
                            </HandDrawnCircle>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                            Access a vast library of resources tagged by course,
                            semester, and university. Leverage AI to generate
                            study notes, flashcards, and knowledge trees
                            instantly.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                            <Link href="/register" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    className="h-12 px-8 bg-[#0A251D] hover:bg-[#0A251D]/90 text-white w-full"
                                >
                                    Start Learning Now
                                </Button>
                            </Link>
                            <Link
                                href="/resources"
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    size="lg"
                                    variant="ghost"
                                    className="h-12 px-8 w-full"
                                >
                                    Explore Resources
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BookOpen className="h-4 w-4" />
                            <span>
                                Join thousands of students and educators
                            </span>
                        </div>
                    </div>

                    <div
                        className="relative aspect-4/3 overflow-hidden rounded-3xl bg-muted"
                        data-aos="fade-left"
                    >
                        <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center text-neutral-400">
                            <span className="text-lg">
                                Platform Dashboard Preview
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
