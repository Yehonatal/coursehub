"use client";

import React from "react";
import {
    Flag,
    Sparkles,
    Download,
    Share2,
    MoreHorizontal,
    Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResourceHeaderActionsProps {
    onGenerateContent: () => void;
    onDownload?: () => void;
    onReport?: () => void;
    onView?: () => void;
}

export function ResourceHeaderActions({
    onGenerateContent,
    onDownload,
    onReport,
    onView,
}: ResourceHeaderActionsProps) {
    return (
        <div className="flex items-center gap-3 border-t border-b border-gray-100 py-4 overflow-x-auto md:overflow-visible">
            <Button
                variant="outline"
                className="inline-flex cursor-pointer items-center gap-2 text-orange-600 max-w-fit border-orange-200 hover:bg-orange-50 hover:text-orange-700 whitespace-nowrap"
                onClick={() => onReport && onReport()}
            >
                <Flag className="w-4 h-4" />
                <span className="hidden sm:inline">Report</span>
            </Button>

            <Button
                className="inline-flex cursor-pointer items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm border-0 px-3 py-2 text-sm whitespace-nowrap"
                onClick={() => onView && onView()}
            >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">View Content</span>
                <span className="sm:hidden">View</span>
            </Button>

            <Button
                className="inline-flex cursor-pointer items-center gap-2 bg-green-600 text-white shadow-sm border-0 px-3 py-2 text-sm whitespace-nowrap"
                onClick={onGenerateContent}
            >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Generate Content</span>
                <span className="sm:hidden">Generate</span>
            </Button>

            <Button
                className="inline-flex cursor-pointer items-center gap-2 bg-[#0E7490] hover:bg-[#0E7490]/90 text-white shadow-sm px-3 py-2 text-sm  whitespace-nowrap"
                onClick={() => onDownload && onDownload()}
            >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
                <span className="sm:hidden"></span>
            </Button>

            <div className="flex-1" />

            <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 cursor-pointer hover:text-gray-600"
            >
                <Share2 className="w-5 h-5" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 cursor-pointer hover:text-gray-600"
            >
                <MoreHorizontal className="w-5 h-5" />
            </Button>
        </div>
    );
}
