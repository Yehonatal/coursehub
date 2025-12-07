"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AIChatModal } from "@/components/ai/AIChatModal";
import { ResourceHeaderActions } from "./ResourceHeaderActions";

interface ResourceHeaderProps {
    title: string;
    rating: number;
    reviews: number;
    downloads: number;
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
    downloads,
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
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center">
                        <h1 className="text-lg md:text-2xl font-bold text-[#0A251D] leading-tight">
                            {title}
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm mt-1">
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
                            ({reviews} reviews)
                        </span>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1 text-gray-600">
                            <Download className="w-4 h-4" />
                            <span>{downloads} downloads</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-2">
                        <span className="font-medium text-[#0A251D]">
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
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/university/haramaya-university"
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <div className="w-12 h-12 rounded-full border border-gray-200 overflow-hidden relative bg-white">
                            <Image
                                src="/hu-logo.jpg"
                                alt={university}
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-[#0A251D]">
                                {university}
                            </p>
                            <p className="text-gray-500">{department}</p>
                        </div>
                    </Link>
                </div>
            </div>

            <ResourceHeaderActions
                onGenerateContent={() => setIsAIModalOpen(true)}
                onDownload={() => {
                    /* TODO: download handler */
                }}
                onReport={() => {
                    /* TODO: report handler */
                }}
            />
        </div>
    );
}
