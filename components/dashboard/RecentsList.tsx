import React from "react";
import { FileText, Network, HelpCircle } from "lucide-react";

interface RecentItem {
    title: string;
    type: string;
    meta: string;
    author: string;
    iconType: "note" | "tree" | "question";
}

interface RecentsListProps {
    items: RecentItem[];
}

const getIcon = (type: string) => {
    switch (type) {
        case "note":
            return <FileText className="h-5 w-5 text-blue-500" />;
        case "tree":
            return <Network className="h-5 w-5 text-teal-500" />;
        case "question":
            return <HelpCircle className="h-5 w-5 text-yellow-500" />;
        default:
            return <FileText className="h-5 w-5 text-gray-500" />;
    }
};

const getBg = (type: string) => {
    switch (type) {
        case "note":
            return "bg-blue-50";
        case "tree":
            return "bg-teal-50";
        case "question":
            return "bg-yellow-50";
        default:
            return "bg-gray-50";
    }
};

export function RecentsList({ items }: RecentsListProps) {
    return (
        <section
            className="mb-8"
            data-aos="fade-up"
            data-aos-delay="200"
            suppressHydrationWarning
        >
            <h3 className="text-lg font-serif font-bold text-[#0A251D] mb-4">
                Recents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-4 group cursor-pointer"
                    >
                        <div
                            className={`h-12 w-12 rounded-xl ${getBg(
                                item.iconType
                            )} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
                        >
                            {getIcon(item.iconType)}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                            <h4 className="font-bold text-[#0A251D] text-sm leading-tight mb-1.5 group-hover:text-blue-600 transition-colors">
                                {item.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                                <span className="text-[#0A251D]">
                                    {item.type}
                                </span>
                                <span className="text-gray-300">•</span>
                                <span>{item.meta}</span>
                                <span className="text-gray-300">•</span>
                                <span>by {item.author}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
