"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    ArrowRight,
    Sparkles,
    MoveRight,
    Monitor,
    WifiOff,
    BookCheck,
} from "lucide-react";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import { TypeAnimation } from "react-type-animation";

export function Hero() {
    const images = [
        { src: "/focusmode_dash.png", alt: "CourseHub Focus Dashboard" },
        { src: "/focusmode_progress.png", alt: "Track Your Progress" },
        { src: "/universitypage.png", alt: "Connect with Campus" },
        { src: "/focusmod_lib.png", alt: "Your Digital Library" },
        { src: "/resourcespage.png", alt: "Quality Resources" },
        { src: "/userpage.png", alt: "User profile" },
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-background">
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-[100%] blur-[120px] opacity-50 animate-pulse-slow" />
                <div className="absolute bottom-[-200px] right-[-200px] w-[800px] h-[600px] bg-blue-500/5 rounded-[100%] blur-[120px]" />
                <div className="absolute top-[20%] left-[10%] w-32 h-32 bg-yellow-500/10 rounded-full blur-[60px]" />
            </div>

            <div className="container px-4 md:px-6 mx-auto">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 mb-20 sm:mb-28">
                    <div
                        data-aos="fade-down"
                        data-aos-delay="100"
                        className="inline-flex"
                    >
                        <Badge
                            variant="secondary"
                            className="px-4 py-1.5 rounded-full text-sm font-medium border border-primary/20 bg-background/50 backdrop-blur-sm text-primary hover:bg-primary/5 transition-all gap-2 shadow-sm"
                        >
                            <Sparkles className="w-3.5 h-3.5 fill-primary" />
                            <span>New: Focus Mode 2.0 is live</span>
                            <div className="w-px h-3 bg-primary/20 mx-1" />
                            <span className="flex items-center gap-1 group cursor-pointer hover:underline underline-offset-4">
                                Try it now{" "}
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                        </Badge>
                    </div>

                    <h1
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-serif font-extrabold tracking-tight text-foreground leading-[1.15] h-[2.3em] sm:h-[2.3em]"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        Master your studies with{" "}
                        <span className="text-primary font-extrabold block min-w-[200px]">
                            <TypeAnimation
                                sequence={[
                                    "AI & Focus.",
                                    2000,
                                    "Human Connection.",
                                    2000,
                                    "Quality Content.",
                                    2000,
                                    "Better Grades.",
                                    2000,
                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                            />
                        </span>
                    </h1>

                    <p
                        className="text-md sm:text-lg text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    >
                        CourseHub replaces your scattered study tools with one
                        intelligent workspace. Manage resources, plan your week,
                        and collaborate with your university community.
                    </p>

                    <div
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4"
                        data-aos="fade-up"
                        data-aos-delay="400"
                    >
                        <Link href="/register">
                            <Button
                                size="lg"
                                className="h-13 px-8 rounded-full text-base sm:text-md font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all w-full sm:w-auto border-none"
                            >
                                Start Studying Smarter
                                <MoveRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/features">
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-13 px-8 rounded-full text-base sm:text-md bg-background/60 backdrop-blur-md border border-input hover:bg-muted/50 hover:border-primary/30 transition-all w-full sm:w-auto"
                            >
                                View Features
                            </Button>
                        </Link>
                    </div>

                    <div
                        className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground font-medium pt-8"
                        data-aos="fade-up"
                        data-aos-delay="500"
                    >
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                            <BookCheck className="w-4 h-4 text-green-500" />
                            Curriculum Aligned
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                            <Monitor className="w-4 h-4 text-blue-500" />
                            Gemini AI Integration
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                            <WifiOff className="w-4 h-4 text-purple-500" />
                            Use Offline
                        </div>
                    </div>
                </div>

                <div
                    className="relative max-w-6xl mx-auto"
                    data-aos="fade-up"
                    data-aos-delay="600"
                    data-aos-offset="0"
                >
                    <div className="relative rounded-xl sm:rounded-2xl border border-border/40 bg-background/40 shadow-2xl overflow-hidden backdrop-blur-md ring-1 ring-white/10 dark:ring-white/5 group transform transition-transform hover:scale-[1.005] duration-700">
                        <div className="flex items-center gap-2px px-4 py-3 border-b border-white/10 bg-muted/30 backdrop-blur-xl sticky top-0 z-10 w-full">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                            </div>
                            <div className="flex-1 text-center mx-4">
                                <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-background/50 rounded-lg text-[11px] text-muted-foreground/80 font-medium shadow-sm border border-black/5 dark:border-white/5 w-full max-w-md mx-auto">
                                    <span className="w-2 h-2 rounded-full bg-primary/80 animate-pulse" />
                                    coursehub.app/study/dashboard
                                </div>
                            </div>
                        </div>

                        <div className="relative w-full bg-muted/5 group-hover:bg-muted/10 transition-colors">
                            <div className="w-full relative overflow-hidden aspect-video">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentImageIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0"
                                    >
                                        <ImageLightbox
                                            src={images[currentImageIndex].src}
                                            alt={images[currentImageIndex].alt}
                                            sizes="(max-width: 1920px) 1000vw, 1920px"
                                            priority
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                        <span className="absolute bottom-4 right-4 bg-background/70 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground flex items-center gap-2 shadow-lg shadow-black/10">
                            Your new cockpit
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
