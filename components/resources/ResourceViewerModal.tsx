"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Maximize2, Minimize2, FileText, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

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
    const [markdownContent, setMarkdownContent] = React.useState<string | null>(
        null
    );
    const [isLoading, setIsLoading] = React.useState(false);

    const isPdf = mimeType === "application/pdf" || fileUrl.endsWith(".pdf");
    const isMarkdown =
        mimeType === "text/markdown" ||
        fileUrl.endsWith(".md") ||
        mimeType === "text/x-markdown";
    const isOffice =
        !isPdf &&
        !isMarkdown &&
        (fileUrl.endsWith(".doc") ||
            fileUrl.endsWith(".docx") ||
            fileUrl.endsWith(".ppt") ||
            fileUrl.endsWith(".pptx"));

    React.useEffect(() => {
        if (isOpen && isMarkdown) {
            setIsLoading(true);
            fetch(fileUrl)
                .then((res) => res.text())
                .then((text) => {
                    setMarkdownContent(text);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching markdown:", err);
                    setIsLoading(false);
                });
        }
    }, [isOpen, isMarkdown, fileUrl]);

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
                        : "rounded-3xl"
                }`}
            >
                <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-border bg-card space-y-0 shrink-0">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                            <FileText className="h-4.5 w-4.5 text-primary/70" />
                        </div>
                        <DialogTitle className="text-lg font-serif font-semibold text-foreground truncate tracking-tight">
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
                    {isMarkdown ? (
                        <div className="w-full h-full overflow-auto p-8 bg-card">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : (
                                <div
                                    className="
                                        prose
                                        prose-slate
                                        dark:prose-invert
                                        max-w-3xl
                                        mx-auto

                                        prose-headings:font-serif
                                        prose-headings:font-bold
                                        prose-headings:tracking-tight

                                        prose-p:text-muted-foreground
                                        prose-p:leading-7
                                        prose-p:my-4

                                        prose-ol:list-decimal
                                        prose-ul:list-disc
                                        prose-ol:pl-8
                                        prose-ul:pl-8
                                        prose-li:my-2
                                        prose-li:marker:text-primary
                                        prose-li:marker:font-bold

                                        prose-blockquote:border-l-primary
                                        prose-blockquote:bg-muted/30
                                        prose-blockquote:rounded-xl
                                        prose-blockquote:px-6
                                        prose-blockquote:py-3

                                        prose-code:bg-muted/60
                                        prose-code:px-1.5
                                        prose-code:py-0.5
                                        prose-code:rounded-md
                                        prose-code:text-sm

                                        prose-pre:bg-muted/50
                                        prose-pre:border
                                        prose-pre:border-border
                                        prose-pre:rounded-2xl
                                        prose-pre:p-4
                                        prose-pre:overflow-x-auto

                                        prose-table:border
                                        prose-table:border-border
                                        prose-th:bg-muted
                                        prose-th:p-2
                                        prose-td:p-2

                                        prose-img:rounded-2xl
                                    "
                                >
                                    <ReactMarkdown
                                        remarkPlugins={[
                                            remarkGfm,
                                            remarkBreaks,
                                        ]}
                                        rehypePlugins={[rehypeRaw]}
                                    >
                                        {markdownContent || ""}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    ) : (
                        <iframe
                            src={viewerUrl}
                            className="w-full h-full border-0"
                            allowFullScreen
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
