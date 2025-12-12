"use client";

import React, { useState } from "react";
import { FileText, Presentation, File } from "lucide-react";

interface ResourcePreviewProps {
    fileUrl: string;
    mimeType?: string;
    className?: string;
}

export function ResourcePreview({
    fileUrl,
    mimeType,
    className,
}: ResourcePreviewProps) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const isPdf = mimeType === "application/pdf" || fileUrl.endsWith(".pdf");
    const isWord =
        fileUrl.endsWith(".doc") ||
        fileUrl.endsWith(".docx") ||
        mimeType?.includes("word");
    const isPpt =
        fileUrl.endsWith(".ppt") ||
        fileUrl.endsWith(".pptx") ||
        mimeType?.includes("presentation");
    const isOffice = isWord || isPpt;

    if (!fileUrl || hasError) {
        return (
            <div
                className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
            >
                {isPdf ? (
                    <FileText className="h-12 w-12" />
                ) : isPpt ? (
                    <Presentation className="h-12 w-12" />
                ) : (
                    <File className="h-12 w-12" />
                )}
            </div>
        );
    }

    let viewerUrl = fileUrl;
    if (isOffice) {
        // Use Office Online Viewer for thumbnails/previews
        // wd=0 means no interactivity (if supported), but embed is usually read-only anyway
        viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            fileUrl
        )}&wdStartOn=1&wdEmbedCode=0`;
    } else if (isPdf) {
        // For PDF, we can try to use the file directly in an iframe or object
        // Adding #toolbar=0 to hide PDF toolbar
        viewerUrl = `${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`;
    }

    return (
        <div
            className={`relative w-full h-full overflow-hidden bg-white ${className}`}
        >
            {/* Loading State */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                    <div className="animate-pulse w-8 h-8 rounded-full bg-gray-200" />
                </div>
            )}

            {/* Overlay to prevent interaction and handle clicks via parent Link */}
            <div className="absolute inset-0 z-20 bg-transparent" />

            <iframe
                src={viewerUrl}
                loading="lazy"
                className="w-full h-full border-0 pointer-events-none select-none"
                onLoad={() => setIsLoading(false)}
                onError={() => setHasError(true)}
                tabIndex={-1}
                scrolling="no"
            />
        </div>
    );
}
