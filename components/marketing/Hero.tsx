import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    HandDrawnCircle,
    HandDrawnUnderline,
} from "@/components/ui/decorations";
import { BookOpen } from "lucide-react";
import Image from "next/image";

export function Hero() {
    return (
        <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32 bg-[#F9F9F9]">
            <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
                <div className="grid gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    <div
                        className="space-y-4 sm:space-y-6 md:space-y-8"
                        data-aos="fade-right"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-foreground leading-[1.1]">
                            A centralized,
                            <HandDrawnUnderline className="text-[#F5A623]">
                                adaptive
                            </HandDrawnUnderline>{" "}
                            learning ecosystem for{" "}
                            <HandDrawnCircle className="text-[#F5A623] -rotate-2">
                                everyone.
                            </HandDrawnCircle>
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
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
                        className="relative aspect-4/3 overflow-hidden rounded-3xl"
                        data-aos="fade-left"
                    >
                        <div className="relative bg-background rounded-[16px] sm:rounded-[20px] md:rounded-[24px] border border-border overflow-hidden backdrop-blur">
                            <div className="flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 md:h-10 px-3 sm:px-4 bg-muted/70 border-b border-border/70">
                                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ff6b6b]" />
                                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#ffd166]" />
                                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4ecdc4]" />
                                <div className="ml-2 sm:ml-4 h-2 sm:h-3 w-16 sm:w-20 md:w-24 bg-muted" />
                            </div>
                            <div className="relative aspect-video bg-muted/20 overflow-hidden">
                                <Image
                                    key="/ai.png"
                                    src="/ai.png"
                                    alt="AI Assistant"
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, (max-width: 1280px) 60vw, 50vw"
                                    className="object-cover object-top transition duration-700 ease-out"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/35 to-transparent" />
                            </div>
                            <div
                                className="absolute -top-4 sm:-top-5 -right-2 sm:-right-3 hidden sm:block"
                                aria-hidden
                            >
                                <HandDrawnCircle
                                    className="text-primary"
                                    strokeWidth={2.4}
                                >
                                    <span className="block w-10 sm:w-12 h-10 sm:h-12" />
                                </HandDrawnCircle>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
