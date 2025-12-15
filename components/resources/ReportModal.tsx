"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
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

            const res = await fetch(`/api/resources/${resourceId}/report`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: fullReason }),
            });

            const json = await res.json();

            if (!res.ok) {
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
            <div className="relative z-10 w-full max-w-[425px] bg-white rounded-2xl shadow-2xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Report
                        </p>
                        <h2 className="text-xl font-semibold text-[#0A251D]">
                            Report Resource
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Close report modal"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="reason">Reason</Label>
                        <Select value={reason} onValueChange={setReason}>
                            <SelectTrigger id="reason">
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {REPORT_REASONS.map((r) => (
                                    <SelectItem key={r} value={r}>
                                        {r}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="details">Additional Details</Label>
                        <Textarea
                            id="details"
                            placeholder="Please provide more context..."
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !reason}
                    >
                        {loading ? "Submitting..." : "Submit Report"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
