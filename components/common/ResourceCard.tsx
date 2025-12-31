import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Download, MessageSquare, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { ResourcePreview } from "./ResourcePreview";

interface ResourceCardProps {
    id: string | number;
    title: string;
    rating: number;
    reviews: number;
    description: string;
    tags: string[];
    downloads: number;
    comments: number;
    fileUrl?: string;
    mimeType?: string;
    isAI?: boolean;
    isVerified?: boolean;
    verifier?: {
        name: string;
        date: string;
    };
    variant?: "default" | "mini";
    className?: string;
}

export function ResourceCard({
    id,
    title,
    rating,
    reviews,
    description,
    tags,
    downloads,
    comments,
    fileUrl,
    mimeType,
    isAI,
    isVerified,
    verifier,
    variant = "default",
    className,
}: ResourceCardProps) {
    const isMini = variant === "mini";

    return (
        <Link
            href={`/resources/${id}`}
            className={cn("block group h-full", className)}
        >
            <Card className="h-full flex flex-col overflow-hidden transition-all duration-500 border border-border rounded-3xl hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 bg-card relative">
                <div
                    className={cn(
                        "bg-muted/30 relative overflow-hidden",
                        isMini ? "h-28" : "h-40"
                    )}
                >
                    {fileUrl ? (
                        <ResourcePreview
                            fileUrl={fileUrl}
                            mimeType={mimeType}
                            className="absolute inset-0 group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5 group-hover:scale-110 transition-transform duration-700 ease-out" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        {isAI && <Badge variant="ai" />}
                        {isVerified ? (
                            <div className="group/verifier relative">
                                <Badge variant="verified" />
                                {verifier && (
                                    <div className="absolute top-full left-0 mt-2 hidden group-hover/verifier:block w-40 p-2 bg-card backdrop-blur-md border border-border rounded-xl shadow-xl z-50 text-[9px] animate-in fade-in slide-in-from-top-1 duration-200">
                                        <p className="font-bold text-primary">
                                            Verified by:
                                        </p>
                                        <p className="text-muted-foreground">
                                            {verifier.name}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Badge variant="neutral">Unverified</Badge>
                        )}
                    </div>
                </div>

                <div
                    className={cn(
                        "flex flex-col flex-1 gap-3",
                        isMini ? "p-4" : "p-6"
                    )}
                >
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                isMini
                                                    ? "h-2.5 w-2.5"
                                                    : "h-3 w-3",
                                                i < Math.floor(rating)
                                                    ? "fill-amber-400 text-amber-400"
                                                    : "fill-muted text-muted"
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="text-[9px] font-bold text-muted-foreground/60">
                                    ({reviews})
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-[9px] font-bold text-primary/60 uppercase tracking-widest">
                                <Download className="h-2.5 w-2.5" />
                                {downloads}
                            </div>
                        </div>

                        <h3
                            className={cn(
                                "font-serif font-bold text-primary tracking-tight leading-tight line-clamp-2 group-hover:text-primary/80 transition-colors",
                                isMini ? "text-base" : "text-lg"
                            )}
                        >
                            {title}
                        </h3>
                    </div>

                    <p
                        className={cn(
                            "text-muted-foreground/70 line-clamp-2 leading-relaxed font-medium",
                            isMini ? "text-xs" : "text-sm"
                        )}
                    >
                        {description}
                    </p>

                    {!isMini && tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto pt-2">
                            {tags.slice(0, 3).map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 bg-muted/50 text-muted-foreground text-[10px] font-bold rounded-full border border-border/50"
                                >
                                    {tag}
                                </span>
                            ))}
                            {tags.length > 3 && (
                                <span className="text-[10px] font-bold text-muted-foreground/40 self-center">
                                    +{tags.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    <div
                        className={cn(
                            "flex items-center justify-between pt-3 mt-1 border-t border-border/40",
                            isMini && "mt-auto"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-muted-foreground/60 text-[10px] font-bold">
                                <MessageSquare className="h-3 w-3" />
                                {comments}
                            </div>
                        </div>

                        <div
                            className={cn(
                                "rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300",
                                isMini ? "h-7 w-7" : "h-8 w-8"
                            )}
                        >
                            <MoreHorizontal
                                className={isMini ? "h-3.5 w-3.5" : "h-4 w-4"}
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
