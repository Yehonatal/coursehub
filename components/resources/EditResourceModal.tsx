"use client";

import React, { useEffect, useState } from "react";
import { useActionState } from "react";
import { X } from "lucide-react";
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
import { updateResource } from "@/app/actions/resource";
import { toast } from "sonner";

const initialState = {
    success: false,
    message: "",
};

interface EditResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    resource: {
        id: string;
        title: string;
        description?: string;
        courseCode: string;
        semester: string;
        university: string;
        type: string;
        tags?: string;
        fileUrl?: string;
        fileName?: string;
    };
}

export function EditResourceModal({
    isOpen,
    onClose,
    resource,
}: EditResourceModalProps) {
    const [state, action, isPending] = useActionState(
        updateResource,
        initialState
    );

    const [resourceType, setResourceType] = useState(resource.type || "");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const id = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(id);
    }, []);

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
        const handler = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        // lock background scroll
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handler);
            document.body.style.overflow = prev || "";
        };
    }, [isOpen, onClose]);

    if (!isOpen || !mounted) return null;

    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                role="dialog"
                aria-modal="true"
                className="relative z-10 w-full max-w-2xl space-y-6 px-6 py-8 bg-white rounded-2xl shadow-2xl"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Resource
                        </p>
                        <h2 className="text-xl font-semibold text-[#0A251D]">
                            Edit Resource
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={onClose}
                        aria-label="Close edit resource modal"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <form
                    className="space-y-6"
                    action={action}
                    encType="multipart/form-data"
                >
                    <input
                        type="hidden"
                        name="resourceId"
                        value={resource.id}
                    />

                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            defaultValue={resource.title}
                            placeholder="e.g. Introduction to Computer Science Notes"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="courseCode">Course Code</Label>
                            <Input
                                id="courseCode"
                                name="courseCode"
                                defaultValue={resource.courseCode}
                                placeholder="e.g. CS101"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="semester">Semester</Label>
                            <Input
                                id="semester"
                                name="semester"
                                defaultValue={resource.semester}
                                placeholder="e.g. Fall 2024"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="university">University</Label>
                            <Input
                                id="university"
                                name="university"
                                defaultValue={resource.university}
                                placeholder="University Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="resourceType">Type</Label>
                            <input
                                type="hidden"
                                name="resourceType"
                                value={resourceType}
                            />
                            <Select
                                value={resourceType}
                                onValueChange={(v) => setResourceType(v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="notes">Notes</SelectItem>
                                    <SelectItem value="slides">
                                        Slides
                                    </SelectItem>
                                    <SelectItem value="exam">
                                        Exam / Quiz
                                    </SelectItem>
                                    <SelectItem value="assignment">
                                        Assignment
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input
                            id="tags"
                            name="tags"
                            defaultValue={resource.tags}
                            placeholder="e.g. math, calculus, engineering"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={resource.description}
                            placeholder="Describe what this resource contains..."
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">Replace File</Label>
                        <input
                            id="file"
                            name="file"
                            type="file"
                            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                            className="file-input"
                        />
                        <p className="text-sm text-muted-foreground">
                            Allowed: PDF, Word, PPT. Max 20MB.
                        </p>
                        {resource.fileName && (
                            <p className="text-sm text-muted-foreground">
                                Current file:{" "}
                                <span className="font-medium">
                                    {resource.fileName}
                                </span>
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => {
                                if (isPending) return;
                                onClose();
                            }}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
