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
    ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportModal } from "./ReportModal";
import { ShareModal } from "./ShareModal";
import { DeleteResourceModal } from "./DeleteResourceModal";
import { EditResourceModal } from "./EditResourceModal";
import { VerifyResourceModal } from "./VerifyResourceModal";
import { useUser } from "@/components/providers/UserProvider";

interface ResourceHeaderActionsProps {
    onGenerateContent: () => void;
    onDownload?: () => void;
    onView?: () => void;
    resourceId: string;
    title: string;
    isOwner: boolean;
    isVerified?: boolean;
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
    isVerified,
    resourceData,
}: ResourceHeaderActionsProps) {
    const { user } = useUser();
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isVerifyOpen, setIsVerifyOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const canVerify =
        user?.role === "educator" && user?.is_verified && !isVerified;

    return (
        <>
            <div className="flex items-center gap-3 border-t border-b border-border py-4 overflow-x-auto md:overflow-visible">
                <Button
                    className="inline-flex cursor-pointer items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm border-0 px-4 py-2 text-sm whitespace-nowrap rounded-xl"
                    onClick={() => onView && onView()}
                >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">View Content</span>
                    <span className="sm:hidden">View</span>
                </Button>

                <Button
                    className="inline-flex cursor-pointer items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-sm border-0 px-4 py-2 text-sm whitespace-nowrap rounded-xl"
                    onClick={onGenerateContent}
                >
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">Generate Content</span>
                    <span className="sm:hidden">Generate</span>
                </Button>

                <Button
                    variant="outline"
                    className="inline-flex cursor-pointer items-center gap-2 shadow-sm px-4 py-2 text-sm whitespace-nowrap rounded-xl border-border"
                    onClick={() => onDownload && onDownload()}
                >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                    <span className="sm:hidden"></span>
                </Button>

                {canVerify && (
                    <Button
                        className="inline-flex cursor-pointer items-center gap-2 bg-accent hover:bg-accent/80 text-accent-foreground shadow-sm border-0 px-4 py-2 text-sm whitespace-nowrap rounded-xl"
                        onClick={() => setIsVerifyOpen(true)}
                    >
                        <ShieldCheck className="w-4 h-4" />
                        <span className="hidden sm:inline">
                            Verify Resource
                        </span>
                        <span className="sm:hidden">Verify</span>
                    </Button>
                )}

                <div className="flex-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground cursor-pointer hover:text-primary rounded-xl"
                    onClick={() => setIsShareOpen(true)}
                >
                    <Share2 className="w-5 h-5" />
                </Button>

                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground cursor-pointer hover:text-primary rounded-xl"
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
                            <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-xl z-20 border border-border py-1 overflow-hidden">
                                {isOwner && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setIsEditOpen(true);
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsDeleteOpen(true);
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 flex items-center gap-2 transition-colors"
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
                                        className="w-full text-left px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2 transition-colors"
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

            <VerifyResourceModal
                isOpen={isVerifyOpen}
                onClose={() => setIsVerifyOpen(false)}
                resourceId={resourceId}
                resourceTitle={title}
            />
        </>
    );
}
