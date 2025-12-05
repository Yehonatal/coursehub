import {
    Users,
    Star,
    MessageSquare,
    ShieldCheck,
    Globe,
    Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    HandDrawnCircle,
    HandDrawnUnderline,
} from "@/components/ui/decorations";

export default function CommunityPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            <div className="container py-20 md:py-32 mx-auto px-4 md:px-6">
                <div
                    className="flex flex-col items-center justify-center space-y-4 text-center mb-20"
                    data-aos="fade-up"
                >
                    <div className="inline-block rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground uppercase tracking-wider mb-2">
                        Our Network
                    </div>
                    <h1 className="text-4xl font-serif font-medium tracking-tight sm:text-5xl md:text-6xl">
                        A Thriving Academic{" "}
                        <HandDrawnUnderline className="text-[#F5A623]">
                            Community
                        </HandDrawnUnderline>
                    </h1>
                    <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed">
                        Join a network of students and educators dedicated to
                        sharing knowledge and ensuring quality.
                    </p>
                </div>

                <div className="grid gap-16 lg:grid-cols-2 items-center mb-32">
                    <div className="space-y-6" data-aos="fade-right">
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider">
                            <Users className="mr-2 h-3 w-3" />
                            Collaboration
                        </div>
                        <h2 className="text-3xl font-serif font-medium tracking-tight">
                            Connect and{" "}
                            <HandDrawnCircle className="text-[#F5A623] -rotate-1">
                                Collaborate
                            </HandDrawnCircle>
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            CourseHub isn't just a repository; it's a living
                            community. Connect with peers from your university
                            and across the country. Share resources, discuss
                            topics, and help each other succeed.
                        </p>
                    </div>
                    <div className="flex justify-center" data-aos="fade-left">
                        <div className="bg-muted/30 p-12 rounded-2xl border border-dashed border-muted-foreground/25 w-full max-w-md h-80 flex items-center justify-center">
                            <Users
                                className="h-32 w-32 text-muted-foreground/20"
                                strokeWidth={1}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid gap-16 lg:grid-cols-2 items-center mb-32">
                    <div
                        className="flex justify-center order-last lg:order-first"
                        data-aos="fade-right"
                    >
                        <div className="bg-muted/30 p-12 rounded-2xl border border-dashed border-muted-foreground/25 w-full max-w-md h-80 flex items-center justify-center">
                            <Star
                                className="h-32 w-32 text-muted-foreground/20"
                                strokeWidth={1}
                            />
                        </div>
                    </div>
                    <div className="space-y-6" data-aos="fade-left">
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider">
                            <Star className="mr-2 h-3 w-3" />
                            Quality Control
                        </div>
                        <h2 className="text-3xl font-serif font-medium tracking-tight">
                            Community{" "}
                            <HandDrawnUnderline className="text-[#F5A623]">
                                Moderation
                            </HandDrawnUnderline>
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            We rely on our community to maintain high standards.
                            Rate resources on a 5-star scale, leave constructive
                            comments, and report inappropriate content. Your
                            feedback helps everyone find the best materials.
                        </p>
                    </div>
                </div>

                <div className="grid gap-16 lg:grid-cols-2 items-center mb-32">
                    <div className="space-y-6" data-aos="fade-right">
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider">
                            <ShieldCheck className="mr-2 h-3 w-3" />
                            Verification
                        </div>
                        <h2 className="text-3xl font-serif font-medium tracking-tight">
                            Educator{" "}
                            <HandDrawnCircle className="text-[#F5A623] -rotate-2">
                                Verification
                            </HandDrawnCircle>
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Educators play a special role on CourseHub. Verified
                            educators can tag content, ensuring its accuracy and
                            relevance. Verified content gets prioritized
                            visibility, giving students confidence in what they
                            study.
                        </p>
                    </div>
                    <div className="flex justify-center" data-aos="fade-left">
                        <div className="bg-muted/30 p-12 rounded-2xl border border-dashed border-muted-foreground/25 w-full max-w-md h-80 flex items-center justify-center">
                            <ShieldCheck
                                className="h-32 w-32 text-muted-foreground/20"
                                strokeWidth={1}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="bg-[#F5F2EB] rounded-3xl p-12 md:p-20 mb-32"
                    data-aos="fade-up"
                >
                    <div className="text-center max-w-3xl mx-auto space-y-8">
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-white px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider">
                            <Globe className="mr-2 h-3 w-3" />
                            Global Network
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#0A251D]">
                            Join the Conversation
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Learning doesn't stop when you leave the classroom.
                            Join our vibrant online communities on Discord and
                            Telegram to chat with fellow students, ask questions
                            in real-time, and stay updated with the latest
                            CourseHub news.
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

                <div className="grid gap-16 lg:grid-cols-2 items-center">
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
                            preparation workshops. Led by top-performing
                            students and verified educators, these sessions are
                            designed to help you tackle difficult subjects and
                            prepare for finals with confidence.
                        </p>
                        <Button variant="outline" className="rounded-full mt-4">
                            View Upcoming Events
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
