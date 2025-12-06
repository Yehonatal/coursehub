import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, MoreHorizontal, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ResourceItem {
    id: number;
    title: string;
    rating: number;
    reviews: number;
    description: string;
    tags: string[];
    downloads: number;
    comments: number;
    isAI?: boolean;
}

interface ResourceGridProps {
    resources: ResourceItem[];
}

export function ResourceGrid({ resources }: ResourceGridProps) {
    return (
        <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            data-aos="fade-up"
            data-aos-delay="300"
            suppressHydrationWarning
        >
            {resources.map((item, i) => (
                <Card
                    key={i}
                    className="p-4 space-y-4 hover:shadow-sm transition-all duration-300 border-border/60 rounded-xl group hover:-translate-y-1"
                >
                    <div className="aspect-video bg-muted rounded-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200 group-hover:scale-105 transition-transform duration-500"></div>
                        {item.isAI && (
                            <div className="absolute top-2 left-2 z-10">
                                <Badge variant="ai" />
                            </div>
                        )}
                        <div className="absolute top-2 right-2">
                            <Badge variant="verified" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-bold text-[#0A251D] leading-tight line-clamp-2">
                            {item.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{item.rating}</span>
                            <span className="text-muted-foreground">
                                ({item.reviews})
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            {item.description}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {item.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-medium text-gray-600"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <Download className="h-3 w-3" />{" "}
                                {item.downloads}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MessageSquare className="h-3 w-3" />{" "}
                                {item.comments}
                            </div>
                        </div>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
}
