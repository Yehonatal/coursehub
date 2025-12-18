"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2, FileText } from "lucide-react";

interface ResourceViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string;
    title: string;
    mimeType?: string;
}

export function ResourceViewerModal({
    isOpen,
    onClose,
    fileUrl,
    title,
    mimeType,
}: ResourceViewerModalProps) {
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    const isPdf = mimeType === "application/pdf" || fileUrl.endsWith(".pdf");
    const isOffice =
        !isPdf &&
        (fileUrl.endsWith(".doc") ||
            fileUrl.endsWith(".docx") ||
            fileUrl.endsWith(".ppt") ||
            fileUrl.endsWith(".pptx"));

    let viewerUrl = fileUrl;
    if (isOffice) {
        viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            fileUrl
        )}`;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className={`max-w-6xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 border-none shadow-2xl overflow-hidden transition-all duration-500 ${
                    isFullscreen
                        ? "max-w-[100vw] w-screen h-screen rounded-none"
                        : "rounded-[2rem]"
                }`}
            >
                <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-border/50 bg-white space-y-0 shrink-0">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                            <FileText className="h-4.5 w-4.5 text-primary/70" />
                        </div>
                        <DialogTitle className="text-lg font-serif font-semibold text-primary truncate tracking-tight">
                            {title}
                        </DialogTitle>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="h-10 w-10 rounded-xl hover:bg-primary/5 text-muted-foreground/40 hover:text-primary transition-all"
                            title={
                                isFullscreen
                                    ? "Exit Fullscreen"
                                    : "Enter Fullscreen"
                            }
                        >
                            {isFullscreen ? (
                                <Minimize2 className="h-5 w-5" />
                            ) : (
                                <Maximize2 className="h-5 w-5" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-10 w-10 rounded-xl hover:bg-primary/5 text-muted-foreground/40 hover:text-primary transition-all"
                            aria-label="Close viewer"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </DialogHeader>
                <div className="flex-1 bg-muted/5 relative overflow-hidden">
                    <iframe
                        src={viewerUrl}
                        className="w-full h-full border-0"
                        allowFullScreen
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
