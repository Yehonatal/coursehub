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
        <section className="w-full py-20 md:py-32 bg-background">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-block rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground uppercase tracking-wider mb-4">
                        Student Value
                    </div>
                    <h2 className="text-3xl font-serif font-medium tracking-tight sm:text-4xl md:text-5xl mb-4">
                        Key benefits for your academic journey
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Built for the specific rigors of higher education in
                        <HandDrawnUnderline className="text-[#F5A623]">
                            Ethiopia.
                        </HandDrawnUnderline>
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((item, i) => (
                        <div
                            key={i}
                            className="group p-6 border border-border/50 hover:border-primary/30 bg-card hover:bg-secondary/20 transition-colors rounded-xl"
                            data-aos="fade-up"
                            data-aos-delay={i * 50}
                        >
                            <div className="mb-4 text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-serif font-bold mb-2">
                                {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
