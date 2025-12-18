import React from "react";
import { Card } from "@/components/ui/card";
import { FileText, Network, HelpCircle } from "lucide-react";

const icons = {
    note: <FileText className="h-4 w-4 text-primary" />,
    tree: <Network className="h-4 w-4 text-primary" />,
    question: <HelpCircle className="h-4 w-4 text-primary" />,
};

export const activityMap: Record<string, keyof typeof icons> = {
    note: "note",
    tree: "tree",
    question: "question",
};

interface ActivityItem {
    title: string;
    type: string;
    meta: string;
    timestamp: string;
}

interface ProfileActivityProps {
    items: ActivityItem[];
}

export function ProfileActivity({ items }: ProfileActivityProps) {
    return (
        <Card
            className="space-y-3 bg-card border border-border shadow-sm p-6"
            data-aos="fade-up"
            data-aos-delay="200"
        >
            <h3 className="text-base font-serif font-bold text-primary">
                Recent Repository Activity
            </h3>
            <div className="space-y-2">
                {items.map((item) => (
                    <div
                        key={item.title + item.timestamp}
                        className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3"
                    >
                        <div className="h-8 w-8 rounded-xl bg-card shadow-sm flex items-center justify-center">
                            {
                                icons[
                                    activityMap[
                                        item.type as keyof typeof activityMap
                                    ]
                                ]
                            }
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                            <p className="text-sm font-medium text-foreground truncate">
                                {item.title}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span>{item.meta}</span>
                                <span>•</span>
                                <span>{item.timestamp}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
