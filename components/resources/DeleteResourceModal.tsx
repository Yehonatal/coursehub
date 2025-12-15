"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteResource } from "@/app/actions/resource";
import { useRouter } from "next/navigation";

interface DeleteResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    resourceId: string;
    resourceTitle: string;
}

export function DeleteResourceModal({
    isOpen,
    onClose,
    resourceId,
    resourceTitle,
}: DeleteResourceModalProps) {
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const id = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(id);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handler);
            document.body.style.overflow = prev || "";
        };
    }, [isOpen, onClose]);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const result = await deleteResource(resourceId);
            if (result.success) {
                toast.success("Resource deleted successfully");
                onClose();
                router.push("/dashboard/resources");
            } else {
                toast.error(result.message || "Failed to delete resource");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !mounted) return null;

    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="relative z-10 w-full max-w-[425px] bg-white rounded-2xl shadow-2xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Resource
                        </p>
                        <h2 className="text-xl font-semibold text-[#0A251D]">
                            Delete Resource
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Close delete modal"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <p className="mt-4 text-sm text-gray-700">
                    Are you sure you want to delete{" "}
                    <strong>{resourceTitle}</strong>? This action cannot be
                    undone.
                </p>

                <div className="flex items-center justify-end gap-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
