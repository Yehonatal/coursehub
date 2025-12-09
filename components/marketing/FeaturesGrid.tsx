import React from "react";
import { BookOpen, Shield, Zap, Users, Bell, BarChart } from "lucide-react";
import { HandDrawnUnderline } from "@/components/ui/decorations";

export function FeaturesGrid() {
    const features = [
        {
            icon: <BookOpen className="h-6 w-6" />,
            title: "Structured Organization",
            desc: "Resources are mandatory tagged by course code, semester, and university, eliminating the chaos of unorganized files.",
        },
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Verified Content",
            desc: "Educator-verified tags prioritize high-quality content, giving you confidence in the materials you use.",
        },
        {
            icon: <Zap className="h-6 w-6" />,
            title: "AI Study Aids",
            desc: "Generate study notes and flashcards instantly from your course materials using advanced AI models.",
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Community Driven",
            desc: "A 5-star rating system and community reporting ensure that the best content rises to the top.",
        },
        {
            icon: <Bell className="h-6 w-6" />,
            title: "Smart Notifications",
            desc: "Get alerts for new content, interactions, and updates on trending materials relevant to your courses.",
        },
        {
            icon: <BarChart className="h-6 w-6" />,
            title: "Personal Analytics",
            desc: "Track your contributions and engagement with a personalized dashboard to monitor your progress.",
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Peer Collaboration",
            desc: "Connect with students from your university and others to share knowledge and resources.",
        },
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Secure Platform",
            desc: "Data isolation and secure authentication ensure your personal information and contributions are safe.",
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
                        <HandDrawnUnderline className="text-[#F5A623]">
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
