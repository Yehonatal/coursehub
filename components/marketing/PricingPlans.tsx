import React from "react";
import { HandDrawnCircle } from "@/components/ui/decorations";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function PricingPlans() {
    return (
        <div className="container mx-auto px-4 md:px-6 mb-32">
            <div className="grid gap-8 md:grid-cols-2 lg:max-w-5xl lg:mx-auto">
                <div
                    className="flex flex-col p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                    data-aos="fade-right"
                >
                    <div className="space-y-2 mb-6">
                        <h3 className="text-2xl font-serif font-bold">
                            Student Basic
                        </h3>
                        <p className="text-muted-foreground">
                            Essential tools for every student.
                        </p>
                    </div>
                    <div className="flex items-baseline text-4xl font-serif font-bold mb-8">
                        <HandDrawnCircle className="text-[#F5A623] -rotate-2">
                            Free
                        </HandDrawnCircle>
                        <span className="ml-2 text-lg font-sans font-normal text-muted-foreground">
                            / forever
                        </span>
                    </div>
                    <ul className="space-y-4 flex-1 mb-8">
                        <li className="flex items-center text-sm">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            Access to all public resources
                        </li>
                        <li className="flex items-center text-sm">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            Upload and share content
                        </li>
                        <li className="flex items-center text-sm">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            Community rating and comments
                        </li>
                        <li className="flex items-center text-sm">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            Limited AI study aid generation (5/month)
                        </li>
                    </ul>
                    <Link href="/register">
                        <Button
                            className="w-full h-12 rounded-full text-base"
                            variant="outline"
                        >
                            Get Started
                        </Button>
                    </Link>
                </div>

                <div
                    className="flex flex-col p-8 bg-[#F5F2EB] border-2 border-primary rounded-2xl shadow-xl relative"
                    data-aos="fade-left"
                >
                    <div className="absolute top-0 right-0 -mt-4 mr-6 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                        Most Popular
                    </div>
                    <div className="space-y-2 mb-6">
                        <h3 className="text-2xl font-serif font-bold text-primary">
                            Student Pro
                        </h3>
                        <p className="text-muted-foreground">
                            Unlock your full potential.
                        </p>
                    </div>
                    <div className="flex items-baseline text-4xl font-serif font-bold mb-8 text-primary">
                        ETB 150
                        <span className="ml-2 text-lg font-sans font-normal text-muted-foreground">
                            / month
                        </span>
                    </div>
                    <ul className="space-y-4 flex-1 mb-8">
                        <li className="flex items-center text-sm font-medium">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            Everything in Basic
                        </li>
                        <li className="flex items-center text-sm font-medium">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            Unlimited AI Flashcards & Notes
                        </li>
                        <li className="flex items-center text-sm font-medium">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            Advanced Analytics Dashboard
                        </li>
                        <li className="flex items-center text-sm font-medium">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            Priority Support
                        </li>
                        <li className="flex items-center text-sm font-medium">
                            <Check className="mr-3 h-5 w-5 text-primary" />
                            Ad-free Experience
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
