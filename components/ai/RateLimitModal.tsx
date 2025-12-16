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

interface RateLimitModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function RateLimitModal({ isOpen, onClose }: RateLimitModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Rate Limit Exceeded</DialogTitle>
                    <DialogDescription>
                        The AI service is currently experiencing high traffic or
                        you have exceeded your rate limit. Please try again in a
                        few moments.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
