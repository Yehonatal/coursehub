import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    HandDrawnCircle,
    HandDrawnUnderline,
} from "@/components/ui/decorations";
import {
    ArrowRight,
    BookOpen,
    Users,
    Zap,
    Shield,
    BarChart,
    Bell,
    GraduationCap,
} from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
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
                                Access a vast library of resources tagged by
                                course, semester, and university. Leverage AI to
                                generate study notes, flashcards, and knowledge
                                trees instantly.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                                <Link
                                    href="/register"
                                    className="w-full sm:w-auto"
                                >
                                    <Button
                                        size="lg"
                                        className="h-12 px-8 bg-[#0A251D] hover:bg-[#0A251D]/90 text-white w-full"
                                    >
                                        Start Learning Now{" "}
                                        <ArrowRight className="ml-2 h-4 w-4" />
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
                            className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted"
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

            <section className="w-full py-12 bg-background border-b border-border/40">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-border/60 p-2 flex flex-col md:flex-row items-center gap-4">
                        <div className="flex items-center gap-4 px-2 border-b md:border-b-0 md:border-r border-border/60 w-full md:w-auto">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                <GraduationCap className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-serif font-bold text-lg">
                                    Educator Portal
                                </span>
                                <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
                                    Join Cohort
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 w-full px-4">
                            <input
                                type="text"
                                placeholder="Enter access code..."
                                className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder:text-muted-foreground/60 outline-none"
                            />
                        </div>
                        <div className="p-2 w-full md:w-auto">
                            <Button className="w-full md:w-auto bg-[#0A251D] hover:bg-[#0A251D]/90 text-white h-12 px-8 rounded-lg flex items-center gap-2">
                                Link <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
                            Login and associate to a cohort with your access
                            code
                        </p>
                    </div>
                </div>
            </section>

            <section className="w-full py-20 bg-[#F5F2EB]">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-8">
                            Trusted By{" "}
                            <HandDrawnUnderline className="text-[#F5A623]">
                                Leading
                            </HandDrawnUnderline>{" "}
                            Ethiopian Universities
                        </h3>
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-70 grayscale">
                            <div className="h-12 w-48 bg-neutral-800/10 rounded flex items-center justify-center font-serif font-bold text-neutral-800/40">
                                Addis Ababa University
                            </div>
                            <div className="h-12 w-48 bg-neutral-800/10 rounded flex items-center justify-center font-serif font-bold text-neutral-800/40">
                                Adama Science & Tech
                            </div>
                            <div className="h-12 w-48 bg-neutral-800/10 rounded flex items-center justify-center font-serif font-bold text-neutral-800/40">
                                Jimma University
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        <div className="bg-transparent p-8">
                            <div className="text-4xl text-primary/20 font-serif mb-6">
                                “
                            </div>
                            <h3 className="text-2xl font-serif leading-relaxed mb-6 text-foreground">
                                &quot;The diversity of topics, the connection
                                with industry standards, and the quality of
                                AI-generated study aids are impressive.&quot;
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center font-bold text-neutral-600">
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
                            <div className="text-4xl text-primary/20 font-serif mb-6">
                                “
                            </div>
                            <h3 className="text-2xl font-serif leading-relaxed mb-6 text-foreground">
                                &quot;CourseHub relieves the burden of having to
                                manually verify every resource for our
                                students.&quot;
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center font-bold text-neutral-600">
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

            <section className="w-full py-20 md:py-32 bg-muted/30">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <h2 className="text-3xl font-serif font-medium tracking-tight sm:text-4xl md:text-5xl mb-4">
                            How CourseHub{" "}
                            <HandDrawnUnderline className="text-[#F5A623]">
                                works
                            </HandDrawnUnderline>{" "}
                            with your studies
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
                                Upload and access educational resources like
                                PDFs and docs, strictly tagged by course code
                                and university for easy retrieval.
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
                                Rate content, leave comments, and rely on
                                educator verification to ensure you're studying
                                the best material available.
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
                                Transform static documents into dynamic study
                                aids like flashcards and knowledge trees using
                                our Gemini Studio integration.
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

            <section className="w-full py-20 md:py-32 bg-background">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <div className="inline-block rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground uppercase tracking-wider mb-4">
                            Student Value
                        </div>
                        <h2 className="text-3xl font-serif font-medium tracking-tight sm:text-4xl md:text-5xl mb-4">
                            Key benefits for your academic journey
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                            Built for the specific rigors of higher education in
                            Ethiopia.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {[
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
                        ].map((item, i) => (
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

            <section className="w-full py-24 bg-primary text-primary-foreground">
                <div className="container px-4 md:px-6 mx-auto text-center">
                    <div
                        className="max-w-3xl mx-auto space-y-8"
                        data-aos="zoom-in"
                    >
                        <h2 className="text-3xl font-serif font-medium tracking-tight sm:text-4xl md:text-5xl">
                            Ready to elevate your academic performance?
                        </h2>
                        <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto">
                            Join thousands of students and educators on
                            CourseHub today.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="rounded-full px-8 h-12 text-base font-medium w-full sm:w-auto"
                                >
                                    Get Started for Free
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="rounded-full px-8 h-12 text-base font-medium bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary w-full sm:w-auto"
                                >
                                    Contact Support
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
