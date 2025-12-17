import React, { useState } from "react";
import { X, Save } from "lucide-react";
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
    resourceTitle?: string;
}

export function AIStudyNoteModal({
    isOpen,
    onClose,
    note,
    resourceId,
    resourceTitle,
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
                title: resourceTitle
                    ? `Study Notes - ${resourceTitle}`
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
            <Card className="w-full max-w-3xl max-h-[80vh] overflow-y-auto relative">
                <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <CardHeader>
                    <CardTitle>{note.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">Summary</h3>
                        <p className="text-muted-foreground">{note.summary}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Key Points</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            {note.keyPoints.map((point, i) => (
                                <li key={i}>{point}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Explanation</h3>
                        <div className="prose dark:prose-invert max-w-none">
                            <ReactMarkdown>{note.explanation}</ReactMarkdown>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
