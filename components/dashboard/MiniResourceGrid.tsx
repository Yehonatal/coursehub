import React from "react";
import { Card } from "@/components/ui/card";
import { Star, Download } from "lucide-react";
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

export function MiniResourceGrid({ resources }: ResourceGridProps) {
    return (
        <div
            className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-4 gap-4"
            data-aos="fade-up"
            data-aos-delay="300"
            suppressHydrationWarning
        >
            {resources.map((item, i) => (
                <Card
                    key={i}
                    className="overflow-hidden hover:shadow-md transition-all duration-300 border-border/60 group hover:-translate-y-1 rounded-t-lg"
                >
                    <div className="h-28 bg-muted relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-t-lg group-hover:scale-105 transition-transform duration-500"></div>
                        {item.isAI && (
                            <div className="absolute top-2 left-2 z-10">
                                <Badge variant="ai" label="AI" />
                            </div>
                        )}
                        <div className="absolute top-2 right-2">
                            <Badge variant="verified" />
                        </div>
                    </div>
                    <div className="p-3 space-y-2">
                        <div>
                            <h4 className="font-bold text-[#0A251D] text-sm leading-tight line-clamp-2 min-h-[2em]">
                                {item.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {item.description}
                            </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium text-foreground">
                                    {item.rating}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                <span>{item.downloads}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
