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
            return <FileText className="h-5 w-5 text-blue-600" />;
        case "tree":
            return <Network className="h-5 w-5 text-emerald-600" />;
        case "question":
            return <HelpCircle className="h-5 w-5 text-indigo-600" />;
        default:
            return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
};

const getBg = (type: string) => {
    switch (type) {
        case "note":
            return "bg-blue-50/50 border-blue-100/50";
        case "tree":
            return "bg-emerald-50/50 border-emerald-100/50";
        case "question":
            return "bg-indigo-50/50 border-indigo-100/50";
        default:
            return "bg-muted/5 border-border/40";
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
        <div className="space-y-8">
            <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                    Trending
                </p>
                <h3 className="text-xl font-serif font-semibold text-primary tracking-tight">
                    Most Popular Resources
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-5 group cursor-pointer"
                    >
                        <div
                            className={`h-14 w-14 rounded-2xl border ${getBg(
                                item.iconType
                            )} flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-300 shadow-sm group-hover:shadow-md`}
                        >
                            {getIcon(item.iconType)}
                        </div>
                        <div className="space-y-1.5">
                            <h4 className="font-serif font-semibold text-primary text-base group-hover:text-primary/80 transition-colors tracking-tight">
                                {item.title}
                            </h4>
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60 font-medium uppercase tracking-wider">
                                <span className="text-primary/60">
                                    {item.type}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-border" />
                                <span>{item.meta}</span>
                                <span className="h-1 w-1 rounded-full bg-border" />
                                <span className="lowercase">
                                    by {item.author}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
