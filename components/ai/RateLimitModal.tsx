"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";

interface RateLimitModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function RateLimitModal({ isOpen, onClose }: RateLimitModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
                <div className="p-8 space-y-6">
                    <DialogHeader className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-primary">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <DialogTitle className="text-2xl font-serif font-semibold tracking-tight">
                                    Rate Limit Reached
                                </DialogTitle>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full hover:bg-primary/10 text-muted-foreground/40 hover:text-primary transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                            The AI service is currently experiencing high
                            traffic or you have exceeded your rate limit. This
                            usually happens with free-tier API keys.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
                        <p className="text-sm text-foreground leading-relaxed">
                            Please wait a few moments before trying again, or
                            consider using a different API key with higher
                            limits.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={onClose}
                            className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/10 transition-all"
                        >
                            Got it
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
