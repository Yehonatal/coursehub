"use client";

import React, { useState } from "react";
import {
    Flag,
    Sparkles,
    Download,
    Share2,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportModal } from "./ReportModal";
import { ShareModal } from "./ShareModal";
import { DeleteResourceModal } from "./DeleteResourceModal";
import { EditResourceModal } from "./EditResourceModal";

interface ResourceHeaderActionsProps {
    onGenerateContent: () => void;
    onDownload?: () => void;
    onView?: () => void;
    resourceId: string;
    title: string;
    isOwner: boolean;
    resourceData?: {
        courseCode: string;
        semester: string;
        university: string;
        type: string;
        description?: string;
        tags?: string;
    };
}

export function ResourceHeaderActions({
    onGenerateContent,
    onDownload,
    onView,
    resourceId,
    title,
    isOwner,
    resourceData,
}: ResourceHeaderActionsProps) {
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <div className="flex items-center gap-3 border-t border-b border-gray-100 py-4 overflow-x-auto md:overflow-visible">
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
                    onClick={() => setIsShareOpen(true)}
                >
                    <Share2 className="w-5 h-5" />
                </Button>

                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 cursor-pointer hover:text-gray-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </Button>

                    {isMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsMenuOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-100 py-1">
                                {isOwner && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setIsEditOpen(true);
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsDeleteOpen(true);
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </>
                                )}
                                {!isOwner && (
                                    <button
                                        onClick={() => {
                                            setIsReportOpen(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                                    >
                                        <Flag className="w-4 h-4" />
                                        Report
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                resourceId={resourceId}
            />

            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                title={title}
                url={typeof window !== "undefined" ? window.location.href : ""}
            />

            {isOwner && resourceData && (
                <>
                    <DeleteResourceModal
                        isOpen={isDeleteOpen}
                        onClose={() => setIsDeleteOpen(false)}
                        resourceId={resourceId}
                        resourceTitle={title}
                    />
                    <EditResourceModal
                        isOpen={isEditOpen}
                        onClose={() => setIsEditOpen(false)}
                        resource={{
                            id: resourceId,
                            title,
                            ...resourceData,
                        }}
                    />
                </>
            )}
        </>
    );
}
