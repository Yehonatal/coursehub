"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2 } from "lucide-react";

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
                className={`max-w-6xl rounded-2xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 ${
                    isFullscreen
                        ? "max-w-[100vw] w-screen h-screen rounded-none border-0"
                        : ""
                }`}
            >
                <DialogHeader className="flex rounded-t-2xl flex-row items-center justify-between px-4 py-3 border-b bg-white space-y-0">
                    <DialogTitle className="text-lg font-semibold truncate flex-1 pr-4">
                        {title}
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="h-8 w-8"
                        >
                            {isFullscreen ? (
                                <Minimize2 className="h-4 w-4" />
                            ) : (
                                <Maximize2 className="h-4 w-4" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>
                <div className="flex-1 bg-gray-100 relative rounded-b-lg overflow-hidden">
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
