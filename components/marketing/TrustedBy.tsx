import React from "react";
import { HandDrawnUnderline } from "@/components/ui/decorations";

export function TrustedBy() {
    return (
        <section className="w-full py-20 bg-muted/30">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-8">
                        Trusted By{" "}
                        <HandDrawnUnderline className="text-primary">
                            Leading
                        </HandDrawnUnderline>{" "}
                        Ethiopian Universities
                    </h3>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-70 grayscale">
                        <div className="h-12 w-48 bg-foreground/5 rounded flex items-center justify-center font-serif font-bold text-foreground/40">
                            Addis Ababa University
                        </div>
                        <div className="h-12 w-48 bg-foreground/5 rounded flex items-center justify-center font-serif font-bold text-foreground/40">
                            Adama Science & Tech
                        </div>
                        <div className="h-12 w-48 bg-foreground/5 rounded flex items-center justify-center font-serif font-bold text-foreground/40">
                            Jimma University
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    <div className="bg-transparent p-8">
                        <div className="text-4xl text-primary/20 font-serif">
                            “
                        </div>
                        <h3 className="text-2xl font-serif leading-relaxed mb-6 text-foreground">
                            The diversity of topics, the connection with
                            industry standards, and the quality of AI-generated
                            study aids are impressive.
                        </h3>
                        <div className="text-4xl text-primary/20 font-serif mb-6">
                            “
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                                A
                            </div>
                            <div>
                                <div className="font-bold text-sm">
                                    Dr. Abebe Kebede
                                </div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Head of Computer Science, AAU
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-transparent p-8">
                        <div className="text-4xl text-primary/20 font-serif">
                            “
                        </div>
                        <h3 className="text-2xl font-serif leading-relaxed mb-6 text-foreground">
                            CourseHub relieves the burden of having to manually
                            verify every resource for our students.
                        </h3>
                        <div className="text-4xl text-primary/20 font-serif mb-6">
                            “
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                                T
                            </div>
                            <div>
                                <div className="font-bold text-sm">
                                    Tigist Mengistu
                                </div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                                    Lecturer, ASTU
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
