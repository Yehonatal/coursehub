import {
    CheckCircle,
    Upload,
    Shield,
    Brain,
    Bell,
    CreditCard,
    BarChart,
    Search,
    FileText,
    GraduationCap,
    BookOpen,
    ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HandDrawnUnderline } from "@/components/ui/decorations";

export default function FeaturesPage() {
    const features = [
        {
            icon: <CheckCircle className="h-8 w-8 text-primary" />,
            title: "Secure Authentication",
            description:
                "Robust user registration, email verification, and session management powered by Supabase Auth. Differentiates between students and educators for tailored experiences.",
        },
        {
            icon: <Upload className="h-8 w-8 text-primary" />,
            title: "Content Submission",
            description:
                "Easily upload educational resources like PDFs and documents. Mandatory tagging by course code, semester, and university ensures organized and accessible content.",
        },
        {
            icon: <Shield className="h-8 w-8 text-primary" />,
            title: "Community Moderation",
            description:
                "A community-driven platform with a 5-star rating system, comments, and reporting. Educator-verified tags prioritize high-quality content visibility.",
        },
        {
            icon: <Brain className="h-8 w-8 text-primary" />,
            title: "AI-Powered Study Aids",
            description:
                "Leverage the power of Gemini Studio API to generate study notes, flashcards, and knowledge trees from uploaded materials to enhance your learning.",
        },
        {
            icon: <Bell className="h-8 w-8 text-primary" />,
            title: "Smart Notifications",
            description:
                "Stay updated with email alerts for account verification, content interactions, and updates on saved or trending materials relevant to your studies.",
        },
        {
            icon: <CreditCard className="h-8 w-8 text-primary" />,
            title: "Premium Access",
            description:
                "Unlock advanced AI features and extended quotas through our subscription module, giving you the edge you need to excel in your academic journey.",
        },
        {
            icon: <BarChart className="h-8 w-8 text-primary" />,
            title: "Analytics Dashboards",
            description:
                "Gain insights with university-specific summaries of content uploads and engagement metrics. Track your personal contributions and impact.",
        },
        {
            icon: <Search className="h-8 w-8 text-primary" />,
            title: "Advanced Search",
            description:
                "Find exactly what you need with powerful filtering by course code, university, tags, and semester. No more endless scrolling.",
        },
        {
            icon: <FileText className="h-8 w-8 text-primary" />,
            title: "Resource Preview",
            description:
                "View documents directly in the browser before downloading. Save time and bandwidth by checking relevance instantly.",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            <div className="container py-20 md:py-32 mx-auto px-4 md:px-6">
                <div
                    className="flex flex-col items-center justify-center space-y-4 text-center mb-20"
                    data-aos="fade-up"
                >
                    <div className="inline-block rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground uppercase tracking-wider mb-2">
                        Platform Capabilities
                    </div>
                    <h1 className="text-4xl font-serif font-medium tracking-tight sm:text-5xl md:text-6xl">
                        Tools designed for academic{" "}
                        <HandDrawnUnderline className="text-[#F5A623]">
                            excellence
                        </HandDrawnUnderline>
                    </h1>
                    <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed">
                        CourseHub combines resource management, community
                        collaboration, and artificial intelligence into one
                        seamless platform.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-32">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex flex-col p-8 border border-border/60 rounded-xl bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                            data-aos="fade-up"
                            data-aos-delay={index * 50}
                        >
                            <div className="p-3 bg-secondary/50 w-fit rounded-lg mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-serif font-bold mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mb-32">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <h2 className="text-3xl font-serif font-medium tracking-tight sm:text-4xl">
                            Tailored for every role
                        </h2>
                        <p className="text-muted-foreground mt-4 text-lg">
                            Whether you're learning or teaching, CourseHub has
                            specific tools for you.
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
                                    <CheckCircle className="h-5 w-5 text-primary mt-1 shrink-0" />
                                    <span className="text-muted-foreground">
                                        Access a vast library of peer-reviewed
                                        study materials.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-primary mt-1 shrink-0" />
                                    <span className="text-muted-foreground">
                                        Generate AI flashcards and summaries to
                                        speed up revision.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-primary mt-1 shrink-0" />
                                    <span className="text-muted-foreground">
                                        Connect with study groups and peers from
                                        your university.
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
                                    <CheckCircle className="h-5 w-5 text-white/80 mt-1 shrink-0" />
                                    <span className="text-white/80">
                                        Verify and curate content to ensure
                                        academic integrity.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-white/80 mt-1 shrink-0" />
                                    <span className="text-white/80">
                                        Gain visibility as a trusted source of
                                        knowledge.
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-white/80 mt-1 shrink-0" />
                                    <span className="text-white/80">
                                        Track engagement with your materials
                                        through analytics.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div
                    className="bg-primary text-primary-foreground rounded-3xl p-12 md:p-20 text-center"
                    data-aos="fade-up"
                >
                    <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">
                        Ready to experience these features?
                    </h2>
                    <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10">
                        Join thousands of students who are already learning
                        smarter with CourseHub.
                    </p>
                    <Link href="/register">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="rounded-full px-8 h-12 text-base font-medium"
                        >
                            Get Started Now{" "}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
