"use client";

import React, { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import {
    Upload,
    X,
    FileText,
    CheckCircle2,
    AlertCircle,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { uploadResource } from "@/app/actions/resource";
import { uploadResourceInitialState } from "@/app/actions/resource.client";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

interface AIUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AIUploadModal({ isOpen, onClose }: AIUploadModalProps) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(
        null
    );
    const [resourceTypeValue, setResourceTypeValue] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [state, action, isPending] = useActionState(
        uploadResource,
        uploadResourceInitialState
    );

    useEffect(() => {
        if (!isOpen) return;
        if (state?.message && state.success) {
            toast.success(state.message);
            onClose();
        } else if (state?.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, onClose, isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const id = window.setTimeout(() => {
            setSelectedFileName(null);
            setResourceTypeValue("");
        }, 0);
        return () => window.clearTimeout(id);
    }, [isOpen]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (fileInputRef.current) {
                const dt = new DataTransfer();
                dt.items.add(file);
                fileInputRef.current.files = dt.files;
                setSelectedFileName(file.name);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFileName(e.target.files[0].name);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
                <form action={action} className="flex flex-col max-h-[90vh]">
                    <input type="hidden" name="isAi" value="true" />
                    <div className="p-8 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500/10 scrollbar-track-transparent">
                        <DialogHeader className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-blue-600">
                                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                        <Sparkles className="h-5 w-5 fill-blue-500/20" />
                                    </div>
                                    <DialogTitle className="text-2xl font-serif font-semibold tracking-tight">
                                        Upload AI Resource
                                    </DialogTitle>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-full hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                                Share AI generated content with the community.
                                Your contributions help others learn faster.
                            </DialogDescription>
                        </DialogHeader>

                        {state?.message && (
                            <div
                                className={cn(
                                    "p-4 rounded-2xl text-sm flex items-center gap-3 border animate-in fade-in slide-in-from-top-2",
                                    state.success
                                        ? "bg-blue-50/50 text-blue-700 border-blue-100"
                                        : "bg-red-50/50 text-red-700 border-red-100"
                                )}
                            >
                                {state.success ? (
                                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                )}
                                <span className="font-medium">
                                    {state.message}
                                </span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-blue-900/70 ml-1">
                                    Resource File{" "}
                                    <span className="text-red-500/50">*</span>
                                </Label>
                                <div
                                    className={cn(
                                        "relative group cursor-pointer rounded-[1.5rem] border-2 border-dashed transition-all duration-300 p-10 text-center",
                                        dragActive
                                            ? "border-blue-500 bg-blue-50/50"
                                            : "border-blue-100 hover:border-blue-300 hover:bg-blue-50/30",
                                        selectedFileName &&
                                            "border-blue-500/30 bg-blue-50/30"
                                    )}
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        name="file"
                                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                                        className="sr-only"
                                        onChange={handleFileChange}
                                        required
                                    />

                                    <div className="flex flex-col items-center gap-4">
                                        {selectedFileName ? (
                                            <>
                                                <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                                                    <FileText className="h-7 w-7" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-blue-700 break-all max-w-[300px]">
                                                        {selectedFileName}
                                                    </p>
                                                    <p className="text-xs font-medium text-blue-600/70">
                                                        Click to change file
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="h-14 w-14 rounded-2xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-300 group-hover:text-blue-500 transition-all duration-300">
                                                    <Upload className="h-7 w-7" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-blue-900/80">
                                                        <span className="text-blue-600 font-bold">
                                                            Click to upload
                                                        </span>{" "}
                                                        or drag and drop
                                                    </p>
                                                    <p className="text-xs text-blue-400/60">
                                                        PDF, Word, or PowerPoint
                                                        (Max 20MB)
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="title"
                                        className="text-sm font-medium text-blue-900/70 ml-1"
                                    >
                                        Title{" "}
                                        <span className="text-red-500/50">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="e.g. Introduction to Computer Science"
                                        required
                                        className="h-12 rounded-xl border-blue-100 bg-blue-50/30 focus:border-blue-300 focus:ring-blue-500/5 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="courseCode"
                                        className="text-sm font-medium text-blue-900/70 ml-1"
                                    >
                                        Course Code{" "}
                                        <span className="text-red-500/50">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="courseCode"
                                        name="courseCode"
                                        placeholder="e.g. CS101"
                                        required
                                        className="h-12 rounded-xl border-blue-100 bg-blue-50/30 focus:border-blue-300 focus:ring-blue-500/5 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="semester"
                                        className="text-sm font-medium text-blue-900/70 ml-1"
                                    >
                                        Semester{" "}
                                        <span className="text-red-500/50">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="semester"
                                        name="semester"
                                        placeholder="e.g. Fall 2024"
                                        required
                                        className="h-12 rounded-xl border-blue-100 bg-blue-50/30 focus:border-blue-300 focus:ring-blue-500/5 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="university"
                                        className="text-sm font-medium text-blue-900/70 ml-1"
                                    >
                                        University{" "}
                                        <span className="text-red-500/50">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="university"
                                        name="university"
                                        placeholder="e.g. Stanford University"
                                        required
                                        className="h-12 rounded-xl border-blue-100 bg-blue-50/30 focus:border-blue-300 focus:ring-blue-500/5 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="resourceType"
                                        className="text-sm font-medium text-blue-900/70 ml-1"
                                    >
                                        Type{" "}
                                        <span className="text-red-500/50">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        value={resourceTypeValue}
                                        onValueChange={setResourceTypeValue}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl border-blue-100 bg-blue-50/30 focus:border-blue-300 focus:ring-blue-500/5 transition-all">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-blue-100 shadow-xl">
                                            <SelectItem value="slides">
                                                Slides
                                            </SelectItem>
                                            <SelectItem value="notes">
                                                Notes
                                            </SelectItem>
                                            <SelectItem value="exam">
                                                Exam
                                            </SelectItem>
                                            <SelectItem value="assignment">
                                                Assignment
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <input
                                        type="hidden"
                                        name="resourceType"
                                        value={resourceTypeValue}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="description"
                                    className="text-sm font-medium text-blue-900/70 ml-1"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Briefly describe what this resource covers..."
                                    className="min-h-[100px] rounded-xl border-blue-100 bg-blue-50/30 focus:border-blue-300 focus:ring-blue-500/5 transition-all resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="tags"
                                    className="text-sm font-medium text-blue-900/70 ml-1"
                                >
                                    Tags
                                </Label>
                                <Textarea
                                    id="tags"
                                    name="tags"
                                    placeholder="e.g. computer science, programming, java (comma separated)"
                                    className="min-h-[60px] rounded-xl border-blue-100 bg-blue-50/30 focus:border-blue-300 focus:ring-blue-500/5 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-t border-blue-100 bg-blue-50/30 flex items-center justify-end gap-3">
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="rounded-xl text-blue-400 hover:text-blue-600 hover:bg-blue-50 font-medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="min-w-[120px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/10 transition-all"
                        >
                            {isPending ? (
                                <>
                                    <span className="animate-spin mr-2">
                                        ⏳
                                    </span>
                                    Uploading...
                                </>
                            ) : (
                                "Upload AI Resource"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
