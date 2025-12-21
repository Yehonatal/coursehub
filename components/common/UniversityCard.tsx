import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/utils/cn";

interface UniversityCardProps {
    name: string;
    slug: string;
    description?: string | null;
    location?: string | null;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    isOfficial?: boolean;
    className?: string;
}

export function UniversityCard({
    name,
    slug,
    description,
    location,
    logoUrl,
    bannerUrl,
    isOfficial,
    className,
}: UniversityCardProps) {
    return (
        <Link href={`/university/${slug}`} className="block group">
            <Card
                className={cn(
                    "overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 h-full",
                    className
                )}
            >
                <div className="relative h-24 w-full bg-muted overflow-hidden">
                    {bannerUrl ? (
                        <Image
                            src={bannerUrl}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                    )}
                    {isOfficial && (
                        <Badge
                            variant="verified"
                            className="absolute top-3 right-3"
                        >
                            Official
                        </Badge>
                    )}
                </div>

                <div className="p-5 pt-0 -mt-8 relative">
                    <div className="h-16 w-16 rounded-2xl border-4 border-background bg-background overflow-hidden shadow-lg mb-3">
                        {logoUrl ? (
                            <Image
                                src={logoUrl}
                                alt={`${name} logo`}
                                width={64}
                                height={64}
                                className="object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary/5 text-primary font-serif font-bold text-xl">
                                {name.charAt(0)}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-serif font-bold text-lg text-primary group-hover:text-primary/80 transition-colors line-clamp-1">
                            {name}
                        </h3>

                        {location && (
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                                <MapPin className="h-3 w-3" />
                                <span className="line-clamp-1">{location}</span>
                            </div>
                        )}

                        {description && (
                            <p className="text-muted-foreground/70 text-xs line-clamp-2 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    );
}
