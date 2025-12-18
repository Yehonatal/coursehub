import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UniversityHeaderProps {
    name: string;
    description: string;
    type: string;
    website: string;
    logoUrl: string;
    bannerUrl?: string;
}

export function UniversityHeader({
    name,
    description,
    type,
    website,
    logoUrl,
    bannerUrl,
}: UniversityHeaderProps) {
    return (
        <div className="relative mb-8">
            <div className="h-20 sm:h-38 w-full rounded-[2rem] bg-linear-to-br from-primary/10 via-primary/5 to-transparent relative overflow-hidden border border-border/40">
                {bannerUrl ? (
                    <Image
                        src={bannerUrl}
                        alt="Banner"
                        fill
                        className="object-cover opacity-80"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle, currentColor 1px, transparent 1px)",
                                backgroundSize: "24px 24px",
                            }}
                        />
                        <div className="flex flex-col items-center gap-4 opacity-40 text-center p-8">
                            <div className="relative h-16 w-16 shrink-0 grayscale opacity-50">
                                <Image
                                    src={logoUrl}
                                    alt={name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/40" />
            </div>

            <div className="px-6 sm:px-10 pb-4 relative">
                <div className="flex flex-col md:flex-row items-start gap-6 -mt-10 md:-mt-14 relative z-10">
                    <div className="h-20 w-20 md:h-32 md:w-32 rounded-[2rem] border-4 border-white bg-white shadow-2xl relative overflow-hidden shrink-0 flex items-center justify-center p-4">
                        <Image
                            src={logoUrl}
                            alt={name}
                            fill
                            sizes="(max-width: 768px) 80px, 128px"
                            className="object-contain p-4"
                        />
                    </div>

                    <div className="flex-1 space-y-3 md:pt-16">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1.5">
                                <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">
                                    {name}
                                </h1>
                                <div className="flex items-center gap-3 text-[10px] md:text-xs text-muted-foreground/60 font-medium">
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] px-2 py-0"
                                    >
                                        {type}
                                    </Badge>
                                    <span className="h-1 w-1 rounded-full bg-border" />
                                    <a
                                        href={website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 hover:text-primary transition-colors"
                                    >
                                        {website.replace(/^https?:\/\//, "")}
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm md:text-base text-muted-foreground/80 max-w-3xl leading-relaxed font-medium">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
