"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { verifyResource } from "@/app/actions/resource";

interface VerifyResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    resourceId: string;
    resourceTitle: string;
}

export function VerifyResourceModal({
    isOpen,
    onClose,
    resourceId,
    resourceTitle,
}: VerifyResourceModalProps) {
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerify = async () => {
        setIsVerifying(true);
        try {
            const res = await verifyResource(resourceId);
            if (res.success) {
                toast.success(res.message);
                onClose();
            } else {
                toast.error(res.message);
            }
        } catch (_error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
                <div className="p-8 space-y-6">
                    <DialogHeader className="space-y-3">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <DialogTitle className="text-2xl font-serif font-semibold tracking-tight">
                                Verify Resource
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-base leading-relaxed text-muted-foreground">
                            By verifying{" "}
                            <span className="font-semibold text-primary">
                                &quot;{resourceTitle}&quot;
                            </span>
                            , you confirm that this material meets the academic
                            standards of CourseHub.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 bg-secondary/30 p-6 rounded-2xl border border-border/50">
                        <h4 className="text-sm font-bold text-primary uppercase tracking-wider">
                            Verification Requirements:
                        </h4>
                        <ul className="space-y-3">
                            {[
                                "Content is accurate and up-to-date",
                                "Material is relevant to the course and semester",
                                "No copyright violations or prohibited content",
                                "High quality formatting and readability",
                            ].map((req, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-3 text-sm text-muted-foreground"
                                >
                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="text-xs text-muted-foreground italic text-center px-4">
                        Your name will be associated with this verification as a
                        verified educator.
                    </p>

                    <DialogFooter className="flex sm:justify-between gap-3 pt-2">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 rounded-xl hover:bg-secondary/80 font-medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleVerify}
                            disabled={isVerifying}
                            className="flex-1 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-semibold"
                        >
                            {isVerifying ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Confirm Verification"
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
