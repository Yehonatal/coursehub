import React from "react";
import { FileText, Network, HelpCircle } from "lucide-react";

interface PopularResource {
    id: string;
    title: string;
    type: string;
    meta: string;
    author: string;
    iconType: "note" | "tree" | "question";
}

const getIcon = (type: string) => {
    switch (type) {
        case "note":
            return <FileText className="h-5 w-5 text-blue-500 fill-blue-500" />;
        case "tree":
            return <Network className="h-5 w-5 text-teal-500 fill-teal-500" />;
        case "question":
            return (
                <HelpCircle className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            );
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

export function PopularResourcesList() {
    const items: PopularResource[] = [
        {
            id: "1",
            title: "Project Management",
            type: "Note",
            meta: "45 min read",
            author: "Yonatan .A",
            iconType: "note",
        },
        {
            id: "2",
            title: "Project Management",
            type: "Knowledge Tree",
            meta: "20 Terms",
            author: "someone",
            iconType: "tree",
        },
        {
            id: "3",
            title: "Project Management",
            type: "Questions",
            meta: "35 questions",
            author: "Someone",
            iconType: "question",
        },
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#0A251D]">
                Most Popular Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-start gap-4 group cursor-pointer"
                    >
                        <div
                            className={`h-10 w-10 rounded-lg ${getBg(
                                item.iconType
                            )} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                        >
                            {getIcon(item.iconType)}
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-[#0A251D] text-sm group-hover:text-blue-600 transition-colors">
                                {item.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="font-medium text-gray-900">
                                    {item.type}
                                </span>
                                <span>•</span>
                                <span>{item.meta}</span>
                                <span>•</span>
                                <span>by {item.author}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
