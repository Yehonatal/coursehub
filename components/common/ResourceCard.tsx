import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Download, MessageSquare, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

interface ResourceCardProps {
    id: number;
    title: string;
    rating: number;
    reviews: number;
    description: string;
    tags: string[];
    downloads: number;
    comments: number;
    isAI?: boolean;
    isVerified?: boolean;
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
    isAI,
    isVerified,
    variant = "default",
    className,
}: ResourceCardProps) {
    const isMini = variant === "mini";

    return (
        <Link
            href={`/resources/${id}`}
            className={cn("block group h-full", className)}
        >
            <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-all duration-300 border-border/60 rounded-xl hover:-translate-y-1 bg-white">
                <div
                    className={cn(
                        "bg-gray-100 relative overflow-hidden",
                        isMini ? "h-28" : "h-32"
                    )}
                >
                    {/* Placeholder for resource preview */}
                    <div className="absolute inset-0 bg-linear-to-br from-gray-50 to-gray-100 group-hover:scale-105 transition-transform duration-500" />

                    {isAI && (
                        <div className="absolute top-2 left-2 z-10">
                            <Badge variant="ai" />
                        </div>
                    )}

                    {isVerified && (
                        <div className="absolute top-2 right-2">
                            <Badge
                                variant="verified"
                                className="h-6 text-[10px] px-2 bg-white/90 backdrop-blur-sm shadow-sm"
                            />
                        </div>
                    )}
                </div>

                <div
                    className={cn(
                        "flex flex-col flex-1 gap-3",
                        isMini ? "p-3" : "p-4"
                    )}
                >
                    <div className="space-y-1">
                        <h3 className="font-bold text-[#0A251D] text-sm leading-tight line-clamp-2 min-h-[2.5em] group-hover:text-primary transition-colors">
                            {title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-[#0A251D]">
                                {rating}
                            </span>
                            <span className="text-muted-foreground">
                                ({reviews})
                            </span>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {description}
                    </p>

                    {!isMini && (
                        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                            {tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div
                        className={cn(
                            "flex items-center justify-between pt-2 mt-2 border-t border-gray-100",
                            isMini && "mt-auto"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold">
                                <Download className="h-3 w-3" />
                                {downloads}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-medium">
                                <MessageSquare className="h-3 w-3" />
                                {comments}
                            </div>
                        </div>

                        {!isMini && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
                            >
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    );
}
