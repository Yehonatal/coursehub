"use client";

import React, { useEffect, useState } from "react";
import { X, Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    resourceId: string;
}

const REPORT_REASONS = [
    "Inappropriate content",
    "Low quality / Spam",
    "Incorrect information",
    "Copyright violation",
    "Other",
];

export function ReportModal({ isOpen, onClose, resourceId }: ReportModalProps) {
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

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

    const handleSubmit = async () => {
        if (!reason) {
            toast.error("Please select a reason");
            return;
        }

        setLoading(true);
        try {
            const fullReason =
                reason === "Other" ? details : `${reason}: ${details}`;

            const json = await api.resources.report(resourceId, fullReason);

            if (!json.success) {
                throw new Error(json.message || "Failed to submit report");
            }

            toast.success("Report submitted successfully");
            onClose();
            setReason("");
            setDetails("");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Failed to submit report");
            }
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
                        <div className="flex items-center gap-3 text-foreground">
                            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                <Flag className="h-5 w-5 text-primary/70" />
                            </div>
                            <h2 className="text-xl font-serif font-semibold tracking-tight">
                                Report Resource
                            </h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="rounded-full hover:bg-primary/5 text-muted-foreground/40 hover:text-primary transition-colors"
                            aria-label="Close report modal"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2.5">
                            <Label
                                htmlFor="reason"
                                className="text-sm font-medium text-muted-foreground ml-1"
                            >
                                Reason for reporting
                            </Label>
                            <Select value={reason} onValueChange={setReason}>
                                <SelectTrigger
                                    id="reason"
                                    className="h-12 rounded-xl border-border bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all"
                                >
                                    <SelectValue placeholder="Select a reason" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border shadow-xl">
                                    {REPORT_REASONS.map((r) => (
                                        <SelectItem key={r} value={r}>
                                            {r}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2.5">
                            <Label
                                htmlFor="details"
                                className="text-sm font-medium text-muted-foreground ml-1"
                            >
                                Additional Details
                            </Label>
                            <Textarea
                                id="details"
                                placeholder="Please provide more context to help us understand the issue..."
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className="min-h-[120px] rounded-xl border-border bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all resize-none"
                            />
                        </div>
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
                            onClick={handleSubmit}
                            disabled={loading || !reason}
                            className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/10 transition-all"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Report"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
