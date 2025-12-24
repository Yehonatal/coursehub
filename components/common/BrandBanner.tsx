import React from "react";

interface BrandBannerProps {
    text: string;
    watermark?: string;
    className?: string;
    headlineClassName?: string;
}

export default function BrandBanner({
    text,
    watermark,
    className,
    headlineClassName,
}: BrandBannerProps) {
    const wm = watermark || text.trim().split(" ")[0] || text;

    return (
        <div
            className={
                "absolute inset-0 flex items-center justify-center overflow-hidden " +
                (className || "")
            }
        >
            <div className="relative w-full flex items-center justify-center px-8">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.075] select-none pointer-events-none">
                    <span className="text-[12vw] font-serif font-black uppercase tracking-tighter whitespace-nowrap">
                        {wm}
                    </span>
                </div>

                <div className="relative z-10 flex items-center gap-4 md:gap-8">
                    <div className="h-px w-12 md:w-24 bg-linear-to-r from-transparent to-primary/30" />
                    <h2
                        className={
                            "text-lg md:text-3xl font-serif font-bold text-primary/40 uppercase tracking-[0.3em] text-center whitespace-nowrap " +
                            (headlineClassName || "")
                        }
                    >
                        {text}
                    </h2>
                    <div className="h-px w-12 md:w-24 bg-linear-to-l from-transparent to-primary/30" />
                </div>
            </div>
        </div>
    );
}
