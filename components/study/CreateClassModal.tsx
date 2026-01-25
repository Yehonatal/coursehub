"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Check, Plus } from "lucide-react";
import { cn } from "@/utils/cn";

export function CreateClassModal({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#3b82f6"); // Default blue
    const [isOpen, setIsOpen] = useState(false);

    const colors = [
        "#94a3b8", // gray
        "#3b82f6", // blue
        "#8b5cf6", // violet
        "#ec4899", // pink
        "#ef4444", // red
        "#f97316", // orange
        "#eab308", // yellow
        "#22c55e", // green
        "#14b8a6", // teal
        "#78350f", // brown
        "#d4a373", // tan
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement create class logic
        console.log("Creating class:", { name, color });
        setIsOpen(false);
        setName("");
        setColor("#3b82f6");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild className={className}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-medium">
                        Create new class
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                    <div className="space-y-2">
                        <input
                            required
                            placeholder="Class name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-border/60 bg-background hover:bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground">
                            Color
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {colors.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className="h-8 w-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                                    style={{ backgroundColor: c }}
                                >
                                    {color === c && (
                                        <Check
                                            className="w-4 h-4 text-white drop-shadow-md"
                                            strokeWidth={3}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium rounded-lg border border-border/50 hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                        </DialogClose>
                        <button
                            type="submit"
                            disabled={!name}
                            className={cn(
                                "px-6 py-2 text-sm font-medium rounded-lg text-white transition-all shadow-sm",
                                name
                                    ? "bg-stone-500 hover:bg-stone-600"
                                    : "bg-muted text-muted-foreground cursor-not-allowed",
                            )}
                        >
                            Create
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
