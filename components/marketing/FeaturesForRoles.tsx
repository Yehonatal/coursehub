import React from "react";
import { CheckCircle, GraduationCap, BookOpen } from "lucide-react";
import { HandDrawnCircle } from "@/components/ui/decorations";

export function FeaturesForRoles() {
    return (
        <div className="container py-20 md:py-32 px-4 md:px-6 mx-auto mb-32">
            <div className="text-center mb-16">
                <div className="inline-block rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground uppercase tracking-wider mb-4">
                    The Value we provide!
                </div>
                <h2 className="text-3xl font-serif font-medium tracking-tight sm:text-4xl md:text-5xl mb-4">
                    Key benefits for your{" "}
                    <HandDrawnCircle className="text-[#F5A623] -rotate-2">
                        academic journey
                    </HandDrawnCircle>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg mt-6">
                    Built for the specific rigors of higher education in
                    Ethiopia.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                <div
                    className="bg-[#F5F2EB] rounded-3xl p-10 border border-border/50"
                    data-aos="fade-right"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-white rounded-full shadow-sm">
                            <GraduationCap className="h-8 w-8 text-[#0A251D]" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-[#0A251D]">
                            For Students
                        </h3>
                    </div>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-primary mt-1" />{" "}
                            <span className="text-muted-foreground">
                                Access a vast library of peer-reviewed study
                                materials.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-primary mt-1" />{" "}
                            <span className="text-muted-foreground">
                                Generate AI flashcards and summaries to speed up
                                revision.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-primary mt-1" />{" "}
                            <span className="text-muted-foreground">
                                Connect with study groups and peers from your
                                university.
                            </span>
                        </li>
                    </ul>
                </div>

                <div
                    className="bg-[#0A251D] text-white rounded-3xl p-10 border border-border/50"
                    data-aos="fade-left"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-white/10 rounded-full shadow-sm backdrop-blur-sm">
                            <BookOpen className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold">
                            For Educators
                        </h3>
                    </div>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-white/80 mt-1" />{" "}
                            <span className="text-white/80">
                                Verify and curate content to ensure academic
                                integrity.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-white/80 mt-1" />{" "}
                            <span className="text-white/80">
                                Gain visibility as a trusted source of
                                knowledge.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-white/80 mt-1" />{" "}
                            <span className="text-white/80">
                                Track engagement with your materials through
                                analytics.
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
