"use client";

import React, { useEffect, useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
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
                router.push("/dashboard");
                onClose();
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
            <div className="relative z-10 w-full max-w-[450px] bg-card border border-border shadow-2xl rounded-3xl overflow-hidden">
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-destructive">
                            <div className="h-10 w-10 rounded-xl bg-destructive/5 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-serif font-semibold tracking-tight">
                                Delete Resource
                            </h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="rounded-full hover:bg-primary/5 text-muted-foreground/40 hover:text-primary transition-colors"
                            aria-label="Close delete modal"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Are you sure you want to delete{" "}
                            <span className="font-bold text-foreground">
                                "{resourceTitle}"
                            </span>
                            ? This action is permanent and cannot be undone.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={loading}
                            className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold shadow-lg shadow-destructive/10 transition-all"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Resource"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
