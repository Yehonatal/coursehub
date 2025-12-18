import React from "react";
import {
    Users,
    Star,
    ShieldCheck,
    Globe,
    Calendar,
    MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function CommunityHighlights() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:gap-12 md:gap-16 lg:grid-cols-2 items-center mb-16 sm:mb-20 md:mb-24 lg:mb-32">
                <div className="space-y-4 sm:space-y-6" data-aos="fade-right">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider">
                        <Users className="mr-2 h-3 w-3" />
                        Collaboration
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium tracking-tight">
                        Connect and Collaborate
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                        CourseHub is not just a repository; it is a living
                        community. Connect with peers from your university and
                        across the country to share resources and discuss
                        topics.
                    </p>
                </div>
                <div className="flex justify-center" data-aos="fade-left">
                    <div className="bg-muted/30 p-6 sm:p-8 md:p-12 rounded-xl sm:rounded-2xl border border-dashed border-muted-foreground/25 w-full max-w-md h-40 sm:h-60 md:h-80 flex items-center justify-center">
                        <Users
                            className="h-16 sm:h-24 md:h-32 w-16 sm:w-24 md:w-32 text-muted-foreground/20"
                            strokeWidth={1}
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-8 sm:gap-12 md:gap-16 lg:grid-cols-2 items-center mb-16 sm:mb-20 md:mb-24 lg:mb-32">
                <div
                    className="flex justify-center order-last lg:order-first"
                    data-aos="fade-right"
                >
                    <div className="bg-muted/30 p-6 sm:p-8 md:p-12 rounded-xl sm:rounded-2xl border border-dashed border-muted-foreground/25 w-full max-w-md h-40 sm:h-60 md:h-80 flex items-center justify-center">
                        <Star
                            className="h-16 sm:h-24 md:h-32 w-16 sm:w-24 md:w-32 text-muted-foreground/20"
                            strokeWidth={1}
                        />
                    </div>
                </div>
                <div className="space-y-4 sm:space-y-6" data-aos="fade-left">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider">
                        <Star className="mr-2 h-3 w-3" />
                        Quality Control
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium tracking-tight">
                        Community Moderation
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                        We rely on our community to maintain high standards.
                        Rate resources on a 5-star scale, leave constructive
                        comments, and report inappropriate content.
                    </p>
                </div>
            </div>

            <div className="grid gap-8 sm:gap-12 md:gap-16 lg:grid-cols-2 items-center mb-16 sm:mb-20 md:mb-24 lg:mb-32">
                <div className="space-y-4 sm:space-y-6" data-aos="fade-right">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider">
                        <ShieldCheck className="mr-2 h-3 w-3" />
                        Verification
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium tracking-tight">
                        Educator Verification
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                        Educators can tag content to ensure accuracy and
                        relevance. Verified content is prioritized, giving
                        students confidence in their studies.
                    </p>
                </div>
                <div className="flex justify-center" data-aos="fade-left">
                    <div className="bg-muted/30 p-6 sm:p-8 md:p-12 rounded-xl sm:rounded-2xl border border-dashed border-muted-foreground/25 w-full max-w-md h-40 sm:h-60 md:h-80 flex items-center justify-center">
                        <ShieldCheck
                            className="h-16 sm:h-24 md:h-32 w-16 sm:w-24 md:w-32 text-muted-foreground/20"
                            strokeWidth={1}
                        />
                    </div>
                </div>
            </div>

            <div
                className="bg-muted/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-20 mb-16 sm:mb-20 md:mb-24 lg:mb-32"
                data-aos="fade-up"
            >
                <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 px-2 sm:px-4">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider">
                        <Globe className="mr-2 h-3 w-3" />
                        Global Network
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-medium text-foreground">
                        Join the Conversation
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Join our online communities on Discord and Telegram to
                        chat with fellow students, ask questions in real-time,
                        and stay up-to-date.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white h-12 px-8 rounded-full text-base">
                            <MessageSquare className="mr-2 h-5 w-5" />
                            Join Discord Server
                        </Button>
                        <Button className="bg-[#229ED9] hover:bg-[#1A85B8] text-white h-12 px-8 rounded-full text-base">
                            <MessageSquare className="mr-2 h-5 w-5" />
                            Join Telegram Channel
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid gap-16 lg:grid-cols-2 items-center py-16 md:py-24">
                <div
                    className="flex justify-center order-last lg:order-first"
                    data-aos="fade-right"
                >
                    <div className="bg-muted/30 p-12 rounded-2xl border border-dashed border-muted-foreground/25 w-full max-w-md h-80 flex items-center justify-center">
                        <Calendar
                            className="h-32 w-32 text-muted-foreground/20"
                            strokeWidth={1}
                        />
                    </div>
                </div>
                <div className="space-y-6" data-aos="fade-left">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider">
                        <Calendar className="mr-2 h-3 w-3" />
                        Events
                    </div>
                    <h2 className="text-3xl font-serif font-medium tracking-tight">
                        Study Groups & Workshops
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        We regularly organize virtual study groups and exam
                        preparation workshops led by top-performing students and
                        verified educators.
                    </p>
                    <Button variant="outline" className="rounded-full mt-4">
                        View Upcoming Events
                    </Button>
                </div>
            </div>
        </div>
    );
}
