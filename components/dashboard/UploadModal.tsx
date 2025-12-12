"use client";

import React, { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { Upload, X, FileText, CheckCircle2, AlertCircle } from "lucide-react";
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
import { uploadResource } from "@/app/actions/resource";
import { uploadResourceInitialState } from "@/app/actions/resource.client";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
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

    if (!isOpen) return null;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            <form
                action={action}
                className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-20">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Upload Resource
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Share your knowledge with the community
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={onClose}
                        className="h-8 w-8 rounded-full hover:bg-gray-100"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>

                <div className="p-6 space-y-6">
                    {state?.message && (
                        <div
                            className={cn(
                                "p-3 rounded-lg text-sm flex items-center gap-2",
                                state.success
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                            )}
                        >
                            {state.success ? (
                                <CheckCircle2 className="h-4 w-4" />
                            ) : (
                                <AlertCircle className="h-4 w-4" />
                            )}
                            {state.message}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Resource File{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <div
                            className={cn(
                                "relative group cursor-pointer rounded-lg border-2 border-dashed transition-all duration-200 ease-in-out p-8 text-center",
                                dragActive
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 hover:border-primary/50 hover:bg-gray-50",
                                selectedFileName &&
                                    "border-emerald-500 bg-emerald-50/30"
                            )}
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
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

                            <div className="flex flex-col items-center gap-2">
                                {selectedFileName ? (
                                    <>
                                        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-emerald-700 break-all max-w-[300px]">
                                                {selectedFileName}
                                            </p>
                                            <p className="text-xs text-emerald-600">
                                                Click to change file
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-12 w-12 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-700">
                                                <span className="text-primary">
                                                    Click to upload
                                                </span>{" "}
                                                or drag and drop
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                PDF, Word, or PowerPoint (Max
                                                20MB)
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g. Introduction to Computer Science"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="courseCode">
                                Course Code{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="courseCode"
                                name="courseCode"
                                placeholder="e.g. CS101"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="semester">
                                Semester <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="semester"
                                name="semester"
                                placeholder="e.g. Fall 2024"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="university">
                                University{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="university"
                                name="university"
                                placeholder="e.g. Stanford University"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="resourceType">
                                Type <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={resourceTypeValue}
                                onValueChange={setResourceTypeValue}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="slides">
                                        Slides
                                    </SelectItem>
                                    <SelectItem value="notes">Notes</SelectItem>
                                    <SelectItem value="exam">Exam</SelectItem>
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
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Briefly describe what this resource covers..."
                            className="min-h-[100px] resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Textarea
                            id="tags"
                            name="tags"
                            placeholder="e.g. computer science, programming, java (comma separated)"
                            className="min-h-[60px] resize-none"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50/50 sticky bottom-0">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="min-w-[100px]"
                    >
                        {isPending ? (
                            <>
                                <span className="animate-spin mr-2">⏳</span>
                                Uploading...
                            </>
                        ) : (
                            "Upload"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
