import React from "react";
import { HandDrawnUnderline } from "@/components/ui/decorations";

export function PageHeader({
    tag,
    title,
    subtitle,
    children,
}: {
    tag?: React.ReactNode;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    children?: React.ReactNode;
}) {
    return (
        <div className="container py-12 sm:py-16 md:py-24 lg:py-32 mx-auto px-4 sm:px-6 lg:px-8">
            <div
                className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center mb-12 sm:mb-16 md:mb-20"
                data-aos="fade-up"
            >
                {tag && (
                    <div className="inline-block rounded-md bg-secondary px-3 py-1 text-xs sm:text-sm font-medium text-secondary-foreground uppercase tracking-wider mb-2">
                        {tag}
                    </div>
                )}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="max-w-[800px] text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                        {subtitle}
                    </p>
                )}
                {children}
            </div>
        </div>
    );
}
