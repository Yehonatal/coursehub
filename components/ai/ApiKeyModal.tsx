"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (key: string) => void;
    initialKey?: string;
}

export function ApiKeyModal({
    isOpen,
    onClose,
    onSave,
    initialKey = "",
}: ApiKeyModalProps) {
    const [key, setKey] = useState(initialKey);

    useEffect(() => {
        setKey(initialKey);
    }, [initialKey]);

    const handleSave = () => {
        onSave(key);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Gemini API Key</DialogTitle>
                    <DialogDescription>
                        Enter your Google Gemini API key to use the AI features.
                        Your key is stored locally in your browser.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="apiKey" className="text-right">
                            API Key
                        </Label>
                        <Input
                            id="apiKey"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            className="col-span-3"
                            placeholder="AIzaSy..."
                            type="password"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave}>
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
