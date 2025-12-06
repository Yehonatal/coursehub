import React from "react";
import { FileText, Network, HelpCircle } from "lucide-react";

export function ProfileRecents() {
    const items = [
        {
            title: "Project Management",
            type: "Note",
            meta: "45 min read",
            author: "Yonatan .A",
            icon: <FileText className="h-5 w-5 text-blue-500" />,
            bg: "bg-blue-50",
        },
        {
            title: "Object Oriented Systems Analysis and Design",
            type: "Knowledge Tree",
            meta: "20 Terms",
            author: "Yonatan .A",
            icon: <Network className="h-5 w-5 text-teal-500" />,
            bg: "bg-teal-50",
        },
        {
            title: "Advanced Database systems",
            type: "Questions",
            meta: "35 questions",
            author: "Yonatan .A",
            icon: <HelpCircle className="h-5 w-5 text-yellow-500" />,
            bg: "bg-yellow-50",
        },
    ];

    return (
        <div className="mb-12">
            <h3 className="text-sm font-bold text-[#0A251D]/70 mb-4">
                Recents Created Content
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-4 group cursor-pointer"
                    >
                        <div
                            className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
                        >
                            {item.icon}
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
        </div>
    );
}
