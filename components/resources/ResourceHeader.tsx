import React, { useState } from "react";
import {
    Star,
    Flag,
    Sparkles,
    Download,
    Share2,
    MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIChatModal } from "@/components/ai/AIChatModal";

interface ResourceHeaderProps {
    title: string;
    rating: number;
    reviews: number;
    courseCode: string;
    type: string;
    date: string;
    author: string;
    university: string;
    department: string;
}

export function ResourceHeader({
    title,
    rating,
    reviews,
    courseCode,
    type,
    date,
    author,
    university,
    department,
}: ResourceHeaderProps) {
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <AIChatModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                resourceTitle={title}
                resourceType={type}
            />
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-[#0A251D]">
                            {title}
                        </h1>
                        <span className="text-gray-500 text-lg">
                            ({reviews})
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <div className="flex text-yellow-400">
                            {[1, 2, 3, 4].map((i) => (
                                <Star
                                    key={i}
                                    className="w-4 h-4 fill-current"
                                />
                            ))}
                            <Star className="w-4 h-4 fill-current text-gray-300" />
                        </div>
                        <span className="text-gray-600 font-medium">
                            {rating} / 5
                        </span>
                        <span className="text-gray-400">
                            based on {reviews} reviews
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                        <span className="font-medium text-gray-900">
                            {courseCode}
                        </span>
                        <span>•</span>
                        <span>{type}</span>
                        <span>•</span>
                        <span>{date}</span>
                        <span>•</span>
                        <span>By {author}</span>
                    </div>

                    <div className="pt-2 w-fit">
                        <Badge variant="verified" label="Verified" />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-600"></div>
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-gray-900">
                                {university}
                            </p>
                            <p className="text-gray-500">{department}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 border-t border-b border-gray-100 py-4">
                <Button
                    variant="outline"
                    className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                >
                    <Flag className="w-4 h-4" />
                </Button>
                <Button
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    onClick={() => setIsAIModalOpen(true)}
                >
                    <Sparkles className="w-4 h-4" />
                    Generate Content
                </Button>
                <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-sm">
                    <Download className="w-4 h-4" />
                </Button>
                <div className="flex-1"></div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-600"
                >
                    <Share2 className="w-5 h-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-600"
                >
                    <MoreHorizontal className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
