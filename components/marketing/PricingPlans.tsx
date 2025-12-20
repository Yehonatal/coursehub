import React from "react";
import { HandDrawnCircle } from "@/components/ui/decorations";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function PricingPlans() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 md:mb-32">
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:max-w-5xl lg:mx-auto">
                <div
                    className="flex flex-col p-6 sm:p-8 bg-card border border-border rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                    data-aos="fade-right"
                >
                    <div className="space-y-2 mb-4 sm:mb-6">
                        <h3 className="text-xl sm:text-2xl font-serif font-bold">
                            Student Basic
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Essential tools for every student.
                        </p>
                    </div>
                    <div className="flex items-baseline text-3xl sm:text-4xl font-serif font-bold mb-6 sm:mb-8">
                        <HandDrawnCircle className="text-primary -rotate-2">
                            Free
                        </HandDrawnCircle>
                        <span className="ml-2 text-base sm:text-lg font-sans font-normal text-muted-foreground">
                            / forever
                        </span>
                    </div>
                    <ul className="space-y-3 sm:space-y-4 flex-1 mb-6 sm:mb-8">
                        <li className="flex items-center text-xs sm:text-sm">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            Access to all public resources
                        </li>
                        <li className="flex items-center text-xs sm:text-sm">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            Upload and share content
                        </li>
                        <li className="flex items-center text-xs sm:text-sm">
                            <Check className="mr-3 h-5 w-5 text-primary" />5 AI
                            generations per day
                        </li>
                        <li className="flex items-center text-xs sm:text-sm">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            10 AI chats per day
                        </li>
                        <li className="flex items-center text-xs sm:text-sm">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            100MB Cloud Storage
                        </li>
                    </ul>
                    <Link href="/register" className="w-full">
                        <Button
                            className="w-full h-10 sm:h-12 rounded-full text-sm sm:text-base"
                            variant="outline"
                        >
                            Get Started
                        </Button>
                    </Link>
                </div>

                <div
                    className="flex flex-col p-6 sm:p-8 bg-primary/5 border border-primary rounded-xl sm:rounded-2xl shadow-xl relative"
                    data-aos="fade-left"
                >
                    <div className="absolute top-0 right-0 -mt-3 sm:-mt-4 mr-3 sm:mr-6 px-3 sm:px-4 py-0.5 sm:py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                        Most Popular
                    </div>
                    <div className="space-y-2 mb-4 sm:mb-6">
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary">
                            Student Premium
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Unlock your full potential.
                        </p>
                    </div>
                    <div className="flex items-baseline text-3xl sm:text-4xl font-serif font-bold mb-6 sm:mb-8 text-primary">
                        ETB 1498.5
                        <span className="ml-2 text-base sm:text-lg font-sans font-normal text-muted-foreground">
                            / month
                        </span>
                    </div>
                    <ul className="space-y-3 sm:space-y-4 flex-1 mb-6 sm:mb-8">
                        <li className="flex items-center text-xs sm:text-sm font-medium">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            Everything in Basic
                        </li>
                        <li className="flex items-center text-sm font-medium">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            Unlimited AI Generations & Chats
                        </li>
                        <li className="flex items-center text-sm font-medium">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            10GB Cloud Storage
                        </li>
                        <li className="flex items-center text-sm font-medium">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            Advanced Analytics Dashboard
                        </li>
                        <li className="flex items-center text-sm font-medium">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            Priority Support
                        </li>
                    </ul>
                    <Link href="/register?plan=pro">
                        <Button className="w-full h-12 rounded-full text-base">
                            Upgrade Now
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
