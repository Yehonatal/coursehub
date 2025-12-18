"use client";

import React, { useEffect, useState } from "react";
import { useActionState } from "react";
import { X, Loader2 } from "lucide-react";
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

interface ActionState {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
}

const initialState: ActionState = {
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
        fileName?: string;
    };
}

function EditResourceForm({
    resource,
    onClose,
}: {
    resource: EditResourceModalProps["resource"];
    onClose: () => void;
}) {
    const [state, action, isPending] = useActionState(
        updateResource,
        initialState
    );

    const [resourceType, setResourceType] = useState(resource.type || "");

    useEffect(() => {
        if (state?.message && state.success) {
            toast.success(state.message);
            onClose();
        } else if (state?.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, onClose]);

    return (
        <form className="space-y-8" action={action}>
            <input type="hidden" name="resourceId" value={resource.id} />

            <div className="space-y-2.5">
                <Label
                    htmlFor="title"
                    className="text-sm font-medium text-muted-foreground ml-1"
                >
                    Title
                </Label>
                <Input
                    id="title"
                    name="title"
                    defaultValue={resource.title}
                    placeholder="e.g. Introduction to Computer Science Notes"
                    required
                    className="h-12 rounded-xl border-border bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all"
                />
                {state?.errors?.title && (
                    <p className="text-xs text-destructive font-medium ml-1">
                        {state.errors.title[0]}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                    <Label
                        htmlFor="courseCode"
                        className="text-sm font-medium text-muted-foreground ml-1"
                    >
                        Course Code
                    </Label>
                    <Input
                        id="courseCode"
                        name="courseCode"
                        defaultValue={resource.courseCode}
                        placeholder="e.g. CS101"
                        required
                        className="h-12 rounded-xl border-border bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all"
                    />
                    {state?.errors?.courseCode && (
                        <p className="text-xs text-destructive font-medium ml-1">
                            {state.errors.courseCode[0]}
                        </p>
                    )}
                </div>
                <div className="space-y-2.5">
                    <Label
                        htmlFor="semester"
                        className="text-sm font-medium text-muted-foreground ml-1"
                    >
                        Semester
                    </Label>
                    <Input
                        id="semester"
                        name="semester"
                        defaultValue={resource.semester}
                        placeholder="e.g. Fall 2024"
                        required
                        className="h-12 rounded-xl border-border bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all"
                    />
                    {state?.errors?.semester && (
                        <p className="text-xs text-destructive font-medium ml-1">
                            {state.errors.semester[0]}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                    <Label
                        htmlFor="university"
                        className="text-sm font-medium text-muted-foreground ml-1"
                    >
                        University
                    </Label>
                    <Input
                        id="university"
                        name="university"
                        defaultValue={resource.university}
                        placeholder="University Name"
                        className="h-12 rounded-xl border-border bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all"
                    />
                    {state?.errors?.university && (
                        <p className="text-xs text-destructive font-medium ml-1">
                            {state.errors.university[0]}
                        </p>
                    )}
                </div>
                <div className="space-y-2.5">
                    <Label
                        htmlFor="resourceType"
                        className="text-sm font-medium text-muted-foreground ml-1"
                    >
                        Type
                    </Label>
                    <input
                        type="hidden"
                        name="resourceType"
                        value={resourceType}
                    />
                    <Select
                        value={resourceType}
                        onValueChange={(v) => setResourceType(v)}
                    >
                        <SelectTrigger className="h-12 rounded-xl border-border bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border shadow-xl">
                            <SelectItem value="notes">Notes</SelectItem>
                            <SelectItem value="slides">Slides</SelectItem>
                            <SelectItem value="exam">Exam / Quiz</SelectItem>
                            <SelectItem value="assignment">
                                Assignment
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {state?.errors?.resourceType && (
                        <p className="text-xs text-destructive font-medium ml-1">
                            {state.errors.resourceType[0]}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2.5">
                <Label
                    htmlFor="description"
                    className="text-sm font-medium text-muted-foreground ml-1"
                >
                    Description
                </Label>
                <Textarea
                    id="description"
                    name="description"
                    defaultValue={resource.description}
                    placeholder="Briefly describe this resource..."
                    className="min-h-[120px] rounded-xl border-border bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all resize-none"
                />
                {state?.errors?.description && (
                    <p className="text-xs text-destructive font-medium ml-1">
                        {state.errors.description[0]}
                    </p>
                )}
            </div>

            <div className="space-y-2.5">
                <Label
                    htmlFor="tags"
                    className="text-sm font-medium text-muted-foreground ml-1"
                >
                    Tags
                </Label>
                <Input
                    id="tags"
                    name="tags"
                    defaultValue={resource.tags}
                    placeholder="comma, separated, tags"
                    className="h-12 rounded-xl border-border bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all"
                />
                {state?.errors?.tags && (
                    <p className="text-xs text-destructive font-medium ml-1">
                        {state.errors.tags[0]}
                    </p>
                )}
            </div>

            <div className="space-y-2.5">
                <Label
                    htmlFor="file"
                    className="text-sm font-medium text-muted-foreground ml-1"
                >
                    Replace File (Optional)
                </Label>
                <div className="relative">
                    <Input
                        id="file"
                        name="file"
                        type="file"
                        className="h-12 rounded-xl border-border bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                </div>
                {resource.fileName && (
                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider ml-1">
                        Current: {resource.fileName}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={isPending}
                    className="rounded-xl px-6 text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="rounded-xl px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/10 transition-all"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </div>
        </form>
    );
}

export function EditResourceModal({
    isOpen,
    onClose,
    resource,
}: EditResourceModalProps) {
    if (!isOpen) return null;

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
                className="relative z-10 w-full max-w-2xl space-y-6 px-8 py-10 bg-card border border-border shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                            Resource Settings
                        </p>
                        <h2 className="text-2xl font-serif font-semibold text-foreground tracking-tight">
                            Edit Resource
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={onClose}
                        className="rounded-full hover:bg-primary/5 text-muted-foreground/40 hover:text-primary transition-colors"
                        aria-label="Close edit resource modal"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <EditResourceForm resource={resource} onClose={onClose} />
            </div>
        </div>
    );
}
