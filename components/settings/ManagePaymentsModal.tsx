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
import { Plus, CreditCard, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PaymentMethod {
    id: string;
    type: "Tele Birr" | "Chapa" | "CBE";
    last4?: string;
    isDefault: boolean;
}

interface ManagePaymentsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ManagePaymentsModal({
    isOpen,
    onClose,
}: ManagePaymentsModalProps) {
    const [payments, setPayments] = useState<PaymentMethod[]>([
        { id: "1", type: "Tele Birr", last4: "8821", isDefault: true },
    ]);
    const [isAdding, setIsAdding] = useState(false);
    const [showAddOptions, setShowAddOptions] = useState(false);

    const addPayment = async (type: PaymentMethod["type"]) => {
        setIsAdding(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newPayment: PaymentMethod = {
            id: crypto.randomUUID(),
            type,
            last4: "4421", // Static for demo to avoid linter issues with Math.random
            isDefault: payments.length === 0,
        };

        setPayments([...payments, newPayment]);
        setIsAdding(false);
        setShowAddOptions(false);
        toast.success(`${type} added successfully`);
    };

    const removePayment = (id: string) => {
        setPayments(payments.filter((p) => p.id !== id));
        toast.success("Payment method removed");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
                <div className="p-8 space-y-6">
                    <DialogHeader className="space-y-3">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-primary/70" />
                            </div>
                            <DialogTitle className="text-xl font-serif font-semibold tracking-tight">
                                Payment Methods
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                            Manage your saved payment methods for subscriptions
                            and one-time purchases.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-3">
                            {payments.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-white/50 backdrop-blur-sm transition-all hover:border-primary/20"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-11 w-11 rounded-xl bg-primary/5 flex items-center justify-center">
                                            <CreditCard className="h-5 w-5 text-primary/60" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-primary/90 flex items-center gap-2">
                                                {payment.type}
                                                {payment.isDefault && (
                                                    <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                                                        Default
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground font-medium">
                                                •••• {payment.last4}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-xl text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-colors"
                                        onClick={() =>
                                            removePayment(payment.id)
                                        }
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}

                            {payments.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-2xl bg-muted/5">
                                    <p className="text-sm text-muted-foreground font-medium">
                                        No payment methods saved.
                                    </p>
                                </div>
                            )}
                        </div>

                        {!showAddOptions ? (
                            <Button
                                variant="outline"
                                className="w-full h-12 rounded-xl border-dashed border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-primary/70 font-medium transition-all"
                                onClick={() => setShowAddOptions(true)}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Payment Method
                            </Button>
                        ) : (
                            <div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                {(["Tele Birr", "Chapa", "CBE"] as const).map(
                                    (type) => (
                                        <Button
                                            key={type}
                                            variant="outline"
                                            size="sm"
                                            className="h-20 rounded-2xl flex flex-col gap-2 border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all"
                                            onClick={() => addPayment(type)}
                                            disabled={isAdding}
                                        >
                                            {isAdding ? (
                                                <Loader2 className="h-4 w-4 animate-spin text-primary/40" />
                                            ) : (
                                                <>
                                                    <span className="text-xs font-bold text-primary/80">
                                                        {type}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                                        Connect
                                                    </span>
                                                </>
                                            )}
                                        </Button>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="w-full rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
