import React, { useState } from "react";
import { X, Save, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { AIStudyNote } from "@/types/ai";
import { saveGeneration } from "@/app/actions/ai";
import { toast } from "sonner";

interface AIStudyNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    note: AIStudyNote | null;
    resourceId?: string;
    title?: string;
}

export function AIStudyNoteModal({
    isOpen,
    onClose,
    note,
    resourceId,
    title,
}: AIStudyNoteModalProps) {
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
                title: title ? `Study Notes - ${title}` : note.title,
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
            <Card className="w-full max-w-4xl rounded-[2rem] max-h-[85vh] overflow-hidden border-none shadow-2xl flex flex-col">
                <div className="p-8 flex items-center justify-between border-b border-border/50 bg-white shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                            <FileText className="h-6 w-6 fill-primary/20 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
                                Study Notes
                            </h2>
                            <CardTitle className="text-2xl font-serif font-semibold text-primary">
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
                            className="h-10 w-10 rounded-full hover:bg-primary/5 text-muted-foreground/40 hover:text-primary transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <CardContent className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-primary/70 uppercase tracking-wider flex items-center gap-2">
                            Summary
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed font-serif italic">
                            "{note.summary}"
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-primary/70 uppercase tracking-wider flex items-center gap-2">
                            Key Points
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {note.keyPoints.map((point, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-3 p-4 rounded-2xl bg-muted/5 border border-border/50"
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                                        {i + 1}
                                    </span>
                                    <span className="text-sm font-medium text-primary/80">
                                        {point}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-primary/70 uppercase tracking-wider flex items-center gap-2">
                            Detailed Explanation
                        </h3>
                        <div className="prose prose-primary dark:prose-invert max-w-none bg-muted/5 p-8 rounded-[2rem] border border-border/50">
                            <ReactMarkdown>{note.explanation}</ReactMarkdown>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
