"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ExternalLink, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditUniversityModal } from "./EditUniversityModal";

interface UniversityHeaderProps {
    universityId: number;
    name: string;
    description: string;
    type: string;
    website: string;
    logoUrl: string;
    bannerUrl?: string;
    isStaff?: boolean;
    email?: string;
    location?: string;
    isPrivate?: boolean;
}

export function UniversityHeader({
    universityId,
    name,
    description,
    type,
    website,
    logoUrl,
    bannerUrl,
    isStaff,
    email,
    location,
    isPrivate,
}: UniversityHeaderProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <div className="relative mb-8">
            <div className="h-24 sm:h-48 w-full rounded-3xl relative overflow-hidden border border-border/50 ">
                {bannerUrl ? (
                    <Image
                        src={bannerUrl}
                        alt="Banner"
                        fill
                        className="object-cover opacity-90"
                    />
                ) : (
                    <div className="absolute inset-0">
                        <div
                            className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage: `
                                    linear-gradient(to right, currentColor 1px, transparent 1px),
                                    linear-gradient(to bottom, currentColor 1px, transparent 1px)
                                `,
                                backgroundSize: "40px 40px",
                            }}
                        ></div>

                        <div
                            className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Ffilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                            }}
                        ></div>

                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700"></div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4 opacity-20 text-center p-8">
                                <div className="relative h-16 w-16 shrink-0 grayscale">
                                    <Image
                                        src={logoUrl}
                                        alt={name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/20 to-transparent" />
            </div>

            <div className="px-6 sm:px-10 pb-4 relative">
                <div className="flex flex-col md:flex-row items-start gap-6 -mt-10 md:-mt-14 relative z-10">
                    <div className="h-20 w-20 md:h-32 md:w-32 rounded-3xl border border-border bg-card shadow-2xl relative overflow-hidden shrink-0 flex items-center justify-center p-4">
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
                                <div className="flex items-center gap-4">
                                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground tracking-tight">
                                        {name}
                                    </h1>
                                    {isStaff && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setIsEditModalOpen(true)
                                            }
                                            className="h-8 rounded-xl border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 font-bold text-[10px] uppercase tracking-wider"
                                        >
                                            <Settings2 className="h-3.5 w-3.5 mr-1.5" />
                                            Edit Details
                                        </Button>
                                    )}
                                </div>
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

            {isStaff && (
                <EditUniversityModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    university={{
                        id: universityId,
                        name,
                        description,
                        website,
                        email: email || "",
                        location: location || "",
                        logoUrl,
                        bannerUrl,
                        isPrivate: isPrivate || false,
                    }}
                />
            )}
        </div>
    );
}
