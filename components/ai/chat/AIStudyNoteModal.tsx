import React, { useState } from "react";
import { X, Save, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { AIStudyNote } from "@/types/ai";
import { saveGeneration } from "@/app/actions/ai";
import { toast } from "sonner";

interface AIStudyNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    note: AIStudyNote | null;
    resourceId?: string;
    title?: string;
    resourceTitle?: string;
}

export function AIStudyNoteModal({
    isOpen,
    onClose,
    note,
    resourceId,
    title,
    resourceTitle,
}: AIStudyNoteModalProps) {
    // Prefer explicit `resourceTitle` when available (some callers pass that prop)
    const effectiveTitle = resourceTitle ?? title;

    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen || !note) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveGeneration({
                generationType: "notes",
                content: note,
                prompt: note.title,
                resourceId,
                title: effectiveTitle
                    ? `Study Notes - ${effectiveTitle}`
                    : note.title,
            });
            toast.success("Study notes saved to history");
        } catch (error) {
            toast.error("Failed to save notes");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <Card className="w-full max-w-4xl rounded-3xl max-h-[85vh] overflow-hidden border border-border shadow-2xl flex flex-col bg-card">
                <div className="p-8 flex items-center justify-between border-b border-border bg-card shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                Study Notes
                            </h2>
                            <CardTitle className="text-2xl font-serif font-semibold text-foreground">
                                {note.title}
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

                <CardContent className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                            Summary
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed font-serif italic">
                            "{note.summary}"
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                            Key Points
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {note.keyPoints.map((point, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-3 p-4 rounded-2xl bg-muted/50 border border-border"
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                                        {i + 1}
                                    </span>
                                    <span className="text-sm font-medium text-foreground/80">
                                        {point}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                            Detailed Explanation
                        </h3>
                        <div
                            className="
                                prose
                                prose-slate
                                dark:prose-invert
                                max-w-none
                                bg-muted/30
                                p-8
                                rounded-3xl
                                border
                                border-border

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
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                rehypePlugins={[rehypeRaw]}
                            >
                                {note.explanation}
                            </ReactMarkdown>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
