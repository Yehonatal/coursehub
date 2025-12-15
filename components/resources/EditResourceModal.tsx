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
        <form className="space-y-6" action={action}>
            <input type="hidden" name="resourceId" value={resource.id} />

            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    name="title"
                    defaultValue={resource.title}
                    placeholder="e.g. Introduction to Computer Science Notes"
                    required
                />
                {state?.errors?.title && (
                    <p className="text-sm text-red-500">
                        {state.errors.title[0]}
                    </p>
                )}
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
                    {state?.errors?.courseCode && (
                        <p className="text-sm text-red-500">
                            {state.errors.courseCode[0]}
                        </p>
                    )}
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
                    {state?.errors?.semester && (
                        <p className="text-sm text-red-500">
                            {state.errors.semester[0]}
                        </p>
                    )}
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
                    {state?.errors?.university && (
                        <p className="text-sm text-red-500">
                            {state.errors.university[0]}
                        </p>
                    )}
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
                            <SelectItem value="slides">Slides</SelectItem>
                            <SelectItem value="exam">Exam / Quiz</SelectItem>
                            <SelectItem value="assignment">
                                Assignment
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {state?.errors?.resourceType && (
                        <p className="text-sm text-red-500">
                            {state.errors.resourceType[0]}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    defaultValue={resource.description}
                    placeholder="Briefly describe this resource..."
                    className="min-h-[100px]"
                />
                {state?.errors?.description && (
                    <p className="text-sm text-red-500">
                        {state.errors.description[0]}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                    id="tags"
                    name="tags"
                    defaultValue={resource.tags}
                    placeholder="comma, separated, tags"
                />
                {state?.errors?.tags && (
                    <p className="text-sm text-red-500">
                        {state.errors.tags[0]}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="file">Replace File (Optional)</Label>
                <Input id="file" name="file" type="file" />
                {resource.fileName && (
                    <p className="text-xs text-muted-foreground mt-1">
                        Current file: {resource.fileName}
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isPending}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Changes"}
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
                className="relative z-10 w-full max-w-2xl space-y-6 px-6 py-8 bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
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

                <EditResourceForm resource={resource} onClose={onClose} />
            </div>
        </div>
    );
}
