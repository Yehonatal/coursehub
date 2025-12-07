"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";
import {
    HandDrawnCircle,
    HandDrawnUnderline,
} from "@/components/ui/decorations";
import {
    LayoutDashboard,
    Bot,
    Library,
    Users,
    CheckCircle2,
    Sparkles,
} from "lucide-react";

const products = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        title: "Your Academic Command Center",
        description:
            "A centralized hub that brings all your university activities together. Track your progress, view recent resources, and stay updated with campus news.",
        features: [
            "Personalized activity feed",
            "Quick access to recent files",
            "University-wide announcements",
            "Contribution tracking",
        ],
        image: "/homepage.png",
        color: "text-blue-500",
        gradient: "from-blue-500/20 to-cyan-500/20",
        borderColor: "border-blue-500/20",
    },
    {
        id: "ai",
        label: "AI Assistant",
        icon: Bot,
        title: "Smart Study Companion",
        description:
            "Leverage advanced AI to transform how you learn. Generate summaries, create flashcards, and get instant answers to your academic questions.",
        features: [
            "Instant document summarization",
            "Automated flashcard generation",
            "Context-aware chat assistance",
            "Knowledge tree visualization",
        ],
        image: "/ai.png",
        color: "text-purple-500",
        gradient: "from-purple-500/20 to-pink-500/20",
        borderColor: "border-purple-500/20",
    },
    {
        id: "resources",
        label: "Resource Hub",
        icon: Library,
        title: "Verified Academic Content",
        description:
            "Access a vast library of peer-reviewed study materials, organized by course, semester, and university for easy retrieval.",
        features: [
            "Course-specific filtering",
            "Educator-verified content",
            "Smart search capabilities",
            "Easy file uploads and sharing",
        ],
        image: "/resourcespage.png",
        color: "text-green-500",
        gradient: "from-green-500/20 to-emerald-500/20",
        borderColor: "border-green-500/20",
    },
    {
        id: "community",
        label: "Community",
        icon: Users,
        title: "Collaborative Learning",
        description:
            "Connect with peers and educators. Share knowledge, discuss topics, and build your academic reputation within the university network.",
        features: [
            "Course-specific discussion boards",
            "Reputation and badge system",
            "Peer review functionality",
            "Direct messaging",
        ],
        image: "/universitypage.png",
        color: "text-orange-500",
        gradient: "from-orange-500/20 to-yellow-500/20",
        borderColor: "border-orange-500/20",
    },
];
export function ProductShowcase() {
    const [activeTab, setActiveTab] = useState(products[0].id);

    const activeProduct =
        products.find((p) => p.id === activeTab) || products[0];

    return (
        <section className="relative w-full py-14 md:py-28 overflow-hidden bg-background">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[280px] h-[280px] md:w-[420px] md:h-[420px] bg-primary/10 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
                <div className="absolute bottom-0 right-1/4 w-[280px] h-[280px] md:w-[420px] md:h-[420px] bg-secondary/15 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
            </div>

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div
                    className="text-center max-w-3xl mx-auto mb-10 md:mb-14 px-2"
                    data-aos="fade-up"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs md:text-sm font-medium text-primary mb-4">
                        <Sparkles className="h-4 w-4" />
                        <span className="uppercase tracking-wide">
                            Product Tour
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif font-medium tracking-tight mb-3 md:mb-4 text-foreground">
                        Explore the{" "}
                        <HandDrawnUnderline className="text-[#F5A623]">
                            CourseHub
                        </HandDrawnUnderline>{" "}
                        Ecosystem
                    </h2>
                    <p className="text-base md:text-xl text-muted-foreground leading-relaxed px-2">
                        A calm, focused walkthrough of what matters most for
                        students and educators.
                    </p>
                </div>

                <div
                    className="w-full mb-8 md:mb-10"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    {/* Mobile: grid pills with text visible, no sideways scroll */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-1 md:hidden">
                        {products.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => setActiveTab(product.id)}
                                className={cn(
                                    "group flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition-all",
                                    activeTab === product.id
                                        ? "bg-card border-primary/30 text-foreground shadow-md"
                                        : "bg-muted/50 border-border/60 text-muted-foreground hover:border-primary/40"
                                )}
                            >
                                <span
                                    className={cn(
                                        "p-2 rounded-full bg-white/70 shadow-sm transition-colors",
                                        activeTab === product.id
                                            ? product.color
                                            : "text-muted-foreground"
                                    )}
                                    aria-hidden
                                >
                                    <product.icon className="h-4 w-4" />
                                </span>
                                <span className="text-left leading-tight">
                                    {product.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Desktop: horizontal pills with icon + label */}
                    <div className="hidden md:block overflow-x-auto hide-scrollbar">
                        <div className="flex flex-nowrap justify-center gap-2 md:gap-3 px-1 min-w-full snap-x snap-mandatory">
                            {products.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => setActiveTab(product.id)}
                                    className={cn(
                                        "group inline-flex items-center gap-3 px-4 py-2 rounded-full border text-sm font-semibold transition-all snap-center min-w-[140px]",
                                        activeTab === product.id
                                            ? "bg-card border-primary/30 text-foreground shadow-md"
                                            : "bg-muted/50 border-border/60 text-muted-foreground hover:border-primary/40"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "p-2 rounded-full bg-white/70 shadow-sm transition-colors",
                                            activeTab === product.id
                                                ? product.color
                                                : "text-muted-foreground"
                                        )}
                                        aria-hidden
                                    >
                                        <product.icon className="h-4 w-4" />
                                    </span>
                                    <span>{product.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    <div
                        className="order-2 lg:order-1 lg:col-span-5 space-y-5"
                        data-aos="fade-up"
                        data-aos-delay="150"
                    >
                        <div className="inline-flex items-center gap-2 text-[11px] md:text-xs uppercase tracking-[0.18em] text-primary font-semibold">
                            <HandDrawnCircle
                                className="text-primary"
                                strokeWidth={2.6}
                            >
                                Featured
                            </HandDrawnCircle>
                        </div>
                        <div className="flex items-start gap-3 md:gap-4">
                            <div
                                className={cn(
                                    "p-3 rounded-2xl bg-secondary/60",
                                    activeProduct.color
                                )}
                            >
                                <activeProduct.icon className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <div className="space-y-2 md:space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    {activeProduct.label}
                                </p>
                                <h3 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight">
                                    {activeProduct.title}
                                </h3>
                                <p className="text-base text-muted-foreground leading-relaxed">
                                    {activeProduct.description}
                                </p>
                            </div>
                        </div>

                        <div
                            className="flex flex-wrap gap-2"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            {activeProduct.features.map((feature, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-secondary/50 text-xs md:text-sm font-medium text-foreground/90 border border-border/70"
                                >
                                    <CheckCircle2
                                        className={cn(
                                            "h-4 w-4",
                                            activeProduct.color
                                        )}
                                    />
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div
                        className="order-1 lg:order-2 lg:col-span-7 w-full"
                        data-aos="fade-left"
                        data-aos-delay="180"
                    >
                        <div className="relative group">
                            <div
                                className={cn(
                                    "absolute -inset-4 md:-inset-6 rounded-[24px] md:rounded-[28px] bg-gradient-to-tr blur-3xl opacity-40 transition-opacity duration-700",
                                    activeProduct.gradient
                                )}
                            />
                            <div className="relative bg-background rounded-[20px] md:rounded-[24px] border border-border shadow-xl md:shadow-2xl overflow-hidden backdrop-blur">
                                <div className="flex items-center gap-2 h-10 px-4 bg-muted/70 border-b border-border/70">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b6b]" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffd166]" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#4ecdc4]" />
                                    <div className="ml-4 h-3 w-20 md:w-24 rounded-full bg-muted" />
                                </div>
                                <div className="relative aspect-[4/3] md:aspect-[16/9] bg-muted/20 overflow-hidden">
                                    <Image
                                        key={activeProduct.image}
                                        src={activeProduct.image}
                                        alt={activeProduct.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 60vw"
                                        className="object-cover object-top transition duration-700 ease-out"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/35 to-transparent" />
                                </div>
                                <div
                                    className="absolute -top-5 -right-3 hidden md:block"
                                    aria-hidden
                                >
                                    <HandDrawnCircle
                                        className="text-primary"
                                        strokeWidth={2.4}
                                    >
                                        <span className="block w-12 h-12" />
                                    </HandDrawnCircle>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
