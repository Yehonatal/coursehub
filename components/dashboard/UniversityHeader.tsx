import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

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
            <div className="h-32 sm:h-48 w-full rounded-t-xl bg-white border border-border/60 relative overflow-hidden group">
                {bannerUrl ? (
                    <Image
                        src={bannerUrl}
                        alt="Banner"
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-50 to-emerald-50">
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 opacity-80 text-center md:text-left p-4">
                            <div className="relative rounded-full h-12 w-12 md:h-16 md:w-16 shrink-0">
                                <Image
                                    src={logoUrl}
                                    alt={name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-xl md:text-3xl font-serif font-bold text-green-700 line-clamp-1">
                                    {name}
                                </h1>
                                <p className="text-xs md:text-sm text-orange-400 font-medium italic line-clamp-1">
                                    — Building the Basis for Development —
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="relative px-4 md:px-0">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 w-full">
                        <div className="h-16 w-16 md:h-24 md:w-24 rounded-full border-4 border-white bg-white shadow-sm relative md:ml-4 -mt-12 md:-mt-10 overflow-hidden shrink-0">
                            <Image
                                src={logoUrl}
                                alt={name}
                                fill
                                sizes="96"
                                className="object-contain p-1"
                            />
                        </div>
                        <div className="space-y-2 pt-0 md:pt-2 text-center md:text-left w-full">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-[#0A251D]">
                                    {name}
                                </h1>
                                <a
                                    href={website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-500 hover:underline flex items-center justify-center md:justify-start gap-1 md:hidden"
                                >
                                    {website}
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                            <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed mx-auto md:mx-0">
                                {description}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {type}
                            </p>
                        </div>
                    </div>

                    <div>
                        <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:flex text-sm text-blue-500 hover:underline items-center gap-1 pt-4"
                        >
                            {website}
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
