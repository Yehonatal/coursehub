import React, { useState } from "react";
import { X, Save, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { AIKnowledgeNode } from "@/types/ai";
import { saveGeneration } from "@/app/actions/ai";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

interface AIKnowledgeTreeModalProps {
    isOpen: boolean;
    onClose: () => void;
    tree: AIKnowledgeNode | null;
    resourceId?: string;
    title?: string;
    resourceTitle?: string;
}

export function AIKnowledgeTreeModal({
    isOpen,
    onClose,
    tree,
    resourceId,
    title,
    resourceTitle,
}: AIKnowledgeTreeModalProps) {
    // Prefer explicit `resourceTitle` when available (some callers pass that prop)
    const effectiveTitle = resourceTitle ?? title;

    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen || !tree) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveGeneration({
                generationType: "tree",
                content: tree,
                prompt: tree.label,
                resourceId,
                title: effectiveTitle
                    ? `Knowledge Tree - ${effectiveTitle}`
                    : tree.label,
            });
            toast.success("Knowledge tree saved to history");
        } catch (error) {
            toast.error("Failed to save tree");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <Card className="w-full max-w-5xl rounded-3xl max-h-[85vh] overflow-hidden border border-border shadow-2xl flex flex-col bg-card">
                <div className="p-8 flex items-center justify-between border-b border-border bg-card shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Network className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                Knowledge Map
                            </h2>
                            <CardTitle className="text-2xl font-serif font-semibold text-foreground">
                                {tree.label}
                            </CardTitle>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="rounded-xl text-primary hover:bg-primary/5 font-medium"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {isSaving ? "Saving..." : "Save to History"}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-10 w-10 rounded-full hover:bg-primary/5 text-muted-foreground/60 hover:text-primary transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <CardContent className="flex-1 overflow-y-auto p-10 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent bg-muted/30">
                    <div className="max-w-3xl mx-auto">
                        <TreeRenderer node={tree} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function TreeRenderer({
    node,
    level = 0,
}: {
    node: AIKnowledgeNode;
    level?: number;
}) {
    return (
        <div className={cn("relative", level > 0 && "ml-8 mt-4")}>
            {level > 0 && (
                <div className="absolute -left-4 top-0 bottom-0 w-px bg-border" />
            )}
            <div
                className={cn(
                    "group relative flex flex-col gap-2 p-5 rounded-2xl border transition-all duration-300",
                    level === 0
                        ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/10"
                        : "bg-card border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                )}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            "h-2 w-2 rounded-full",
                            level === 0 ? "bg-primary-foreground" : "bg-primary"
                        )}
                    />
                    <span
                        className={cn(
                            "font-serif font-semibold tracking-tight",
                            level === 0 ? "text-lg" : "text-base"
                        )}
                    >
                        {node.label}
                    </span>
                </div>
                {node.description && (
                    <div
                        className={cn(
                            "prose prose-sm max-w-none prose-ol:list-decimal prose-ul:list-disc prose-ol:pl-6 prose-ul:pl-6 prose-li:marker:text-primary prose-li:marker:font-bold",
                            level === 0
                                ? "prose-invert text-primary-foreground/80"
                                : "prose-slate dark:prose-invert text-muted-foreground"
                        )}
                    >
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            rehypePlugins={[rehypeRaw]}
                        >
                            {node.description}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
            {node.children && node.children.length > 0 && (
                <div className="flex flex-col">
                    {node.children.map((child, i) => (
                        <TreeRenderer key={i} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}
