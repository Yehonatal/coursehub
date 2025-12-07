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
        <div className="container py-20 md:py-32 mx-auto px-4 md:px-6">
            <div
                className="flex flex-col items-center justify-center space-y-4 text-center mb-20"
                data-aos="fade-up"
            >
                {tag && (
                    <div className="inline-block rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground uppercase tracking-wider mb-2">
                        {tag}
                    </div>
                )}
                <h1 className="text-4xl font-serif font-medium tracking-tight sm:text-5xl md:text-6xl">
                    {title}
                </h1>
                {subtitle && (
                    <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed">
                        {subtitle}
                    </p>
                )}
                {children}
            </div>
        </div>
    );
}
