"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Upload,
    StickyNote,
    AlertCircle,
    MoreHorizontal,
    Download,
    Maximize2,
    Link as LinkIcon,
    Type,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ResourceViewerProps {
    resource: {
        title: string;
        file_url: string;
        mime_type: string | null;
    } | null;
}

export default function ResourceViewer({ resource }: ResourceViewerProps) {
    const [activeTab, setActiveTab] = useState("materials");
    const [content, setContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (
            resource?.file_url &&
            (resource.mime_type === "text/markdown" ||
                resource.file_url.endsWith(".md"))
        ) {
            setLoading(true);
            fetch(resource.file_url)
                .then((res) => res.text())
                .then((text) => {
                    setContent(text);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to load markdown content", err);
                    setError("Failed to load content");
                    setLoading(false);
                });
        } else {
            setContent(null); // Reset for non-markdown
        }
    }, [resource]);

    if (!resource) {
        return (
            <div className="flex h-full items-center justify-center p-4 bg-background text-muted-foreground">
                No resource loaded
            </div>
        );
    }

    const getViewer = () => {
        const { file_url, mime_type } = resource;
        const type = mime_type?.toLowerCase() || "";

        if (type === "text/markdown" || file_url.endsWith(".md")) {
            if (loading)
                return (
                    <div className="flex justify-center items-center h-full text-muted-foreground gap-2">
                        <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                        Loading content...
                    </div>
                );
            return (
                <div className="prose dark:prose-invert max-w-none p-8 bg-card min-h-full">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content || ""}
                    </ReactMarkdown>
                </div>
            );
        }

        if (type === "application/pdf" || file_url.endsWith(".pdf")) {
            return (
                <iframe
                    src={resource.file_url}
                    className="w-full h-full bg-card"
                    title="Resource Viewer"
                />
            );
        }

        if (
            type.startsWith("text/") ||
            file_url.endsWith(".txt") ||
            file_url.endsWith(".ts") ||
            file_url.endsWith(".js") ||
            file_url.endsWith(".json")
        ) {
            return (
                <iframe
                    src={resource.file_url}
                    className="w-full h-full bg-card"
                    title="Resource Viewer"
                />
            );
        }

        if (
            type.includes("presentation") ||
            file_url.endsWith(".pptx") ||
            type.includes("document") ||
            file_url.endsWith(".docx") ||
            type.includes("sheet") ||
            file_url.endsWith(".xlsx")
        ) {
            const encodedUrl = encodeURIComponent(file_url);
            const viewerUrl = `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`;
            return (
                <iframe
                    src={viewerUrl}
                    className="w-full h-full bg-card"
                    title="Office Viewer"
                />
            );
        }

        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4 bg-background">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <AlertCircle size={24} className="text-muted-foreground" />
                </div>
                <p>Preview not available for this file type.</p>
                <Button asChild variant="outline">
                    <a
                        href={file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download to view
                    </a>
                </Button>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-background border-l border-border">
            <div className="border-b border-border px-4 h-[60px] flex items-center justify-between bg-card shrink-0">
                <div className="flex items-center gap-6">
                    <div className="flex space-x-6">
                        <button
                            onClick={() => setActiveTab("upload")}
                            className={`flex items-center gap-2 text-sm font-medium transition-colors relative py-5 ${
                                activeTab === "upload"
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <Upload size={16} />
                            Upload
                            {activeTab === "upload" && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("materials")}
                            className={`flex items-center gap-2 text-sm font-medium transition-colors relative py-5 ${
                                activeTab === "materials"
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <FileText size={16} />
                            Materials
                            {activeTab === "materials" && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("notes")}
                            className={`flex items-center gap-2 text-sm font-medium transition-colors relative py-5 ${
                                activeTab === "notes"
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <StickyNote size={16} />
                            Notes
                            {activeTab === "notes" && (
                                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />
                            )}
                        </button>
                    </div>
                </div>

                {activeTab === "materials" && (
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                            <Maximize2 size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground"
                        >
                            <MoreHorizontal size={16} />
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-hidden relative">
                {activeTab === "materials" && (
                    <div className="h-full w-full flex flex-col bg-muted/50">
                        <div className="flex-1 w-full h-full overflow-auto">
                            {getViewer()}
                        </div>
                    </div>
                )}

                {activeTab === "notes" && (
                    <div className="h-full bg-card relative">
                        <div className="absolute inset-0 p-8">
                            <textarea
                                className="w-full h-full resize-none outline-none text-base leading-relaxed bg-transparent text-foreground placeholder:text-muted-foreground font-serif"
                                placeholder="Start typing your notes here..."
                            />
                        </div>
                    </div>
                )}

                {activeTab === "upload" && (
                    <div className="h-full w-full p-8 overflow-y-auto bg-card">
                        <div className="max-w-3xl mx-auto">
                            <div className="border border-dashed border-border rounded-xl p-8 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group mb-10">
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 bg-card rounded-lg shadow-sm flex items-center justify-center mb-4 border border-border group-hover:scale-110 transition-transform">
                                        <div className="bg-muted w-8 h-8 rounded flex items-center justify-center">
                                            <Upload
                                                className="text-muted-foreground"
                                                size={16}
                                            />
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-medium text-foreground">
                                        Drag and drop files or
                                    </h3>
                                    <div className="flex gap-2 justify-center mt-4">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 bg-card hover:bg-muted"
                                        >
                                            <Upload className="mr-2 h-3.5 w-3.5" />{" "}
                                            Upload
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 bg-card hover:bg-muted"
                                        >
                                            <LinkIcon className="mr-2 h-3.5 w-3.5" />{" "}
                                            Link
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 bg-card hover:bg-muted"
                                        >
                                            <Type className="mr-2 h-3.5 w-3.5" />{" "}
                                            Type
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-foreground">
                                    Materials (1)
                                </h4>
                                <div className="group bg-card p-3 rounded-xl border border-border hover:border-sidebar-primary/50 transition-all flex items-center justify-between shadow-sm hover:shadow-md">
                                    <div className="flex items-center gap-4 overflow-hidden">
                                        <div className="bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg shrink-0">
                                            <FileText
                                                className="text-red-500 dark:text-red-400 fill-red-100 dark:fill-red-900/20"
                                                size={20}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-sm font-medium text-foreground block truncate">
                                                {resource.title}
                                            </span>
                                            <span className="text-xs text-muted-foreground mt-0.5 block">
                                                PDF • 2.4 MB
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <MoreHorizontal size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
