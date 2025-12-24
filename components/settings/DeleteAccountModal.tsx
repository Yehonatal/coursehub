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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    userFullName: string;
}

export function DeleteAccountModal({
    isOpen,
    onClose,
    userFullName,
}: DeleteAccountModalProps) {
    const [confirmName, setConfirmName] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (confirmName !== userFullName) {
            toast.error(
                "Name does not match. Please type your full name correctly."
            );
            return;
        }

        setIsDeleting(true);
        try {
            const json = await api.me.delete();

            if (json.success) {
                toast.success("Account deleted successfully");
                router.push("/");
                router.refresh();
            } else {
                toast.error(json.message || "Failed to delete account");
            }
        } catch {
            toast.error("An error occurred while deleting your account");
        } finally {
            setIsDeleting(false);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <div className="p-8 space-y-6">
                    <DialogHeader className="space-y-3">
                        <div className="flex items-center gap-3 text-destructive">
                            <div className="h-10 w-10 rounded-xl bg-destructive/5 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <DialogTitle className="text-xl font-serif font-semibold tracking-tight">
                                Delete Account
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                            This action is permanent and cannot be undone. All
                            your data, including uploaded resources and AI
                            history, will be deleted from our servers.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2.5">
                            <Label
                                htmlFor="confirmName"
                                className="text-sm font-medium text-primary/80 ml-1"
                            >
                                To confirm, type your full name:{" "}
                                <span className="font-bold text-primary">
                                    {userFullName}
                                </span>
                            </Label>
                            <Input
                                id="confirmName"
                                placeholder="Type your full name"
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                                className="h-12 rounded-xl border-destructive/10 bg-destructive/[0.02] focus-visible:ring-destructive/20 focus-visible:border-destructive/30 transition-all"
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={
                                confirmName !== userFullName || isDeleting
                            }
                            className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90 text-white font-semibold shadow-lg shadow-destructive/10 transition-all"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete My Account"
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
