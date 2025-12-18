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
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (key: string, model?: string) => void;
    initialKey?: string;
    initialModel?: string;
}

export function ApiKeyModal({
    isOpen,
    onClose,
    onSave,
    initialKey = "",
    initialModel = "gemini-2.5-flash-lite",
}: ApiKeyModalProps) {
    const [key, setKey] = useState(initialKey);
    const [model, setModel] = useState(initialModel);

    useEffect(() => {
        setKey(initialKey);
        setModel(initialModel);
    }, [initialKey, initialModel]);

    const handleSave = () => {
        onSave(key, model);
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
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="model" className="text-right">
                            Model
                        </Label>
                        <div className="col-span-3">
                            {/* Using the project's Select component for a nice dropdown */}
                            <Select
                                defaultValue={model}
                                value={model}
                                onValueChange={(v) => setModel(v)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gemini-2.5-flash">
                                        gemini-2.5-flash
                                    </SelectItem>
                                    <SelectItem value="gemini-2.5-flash-lite">
                                        gemini-2.5-flash-lite
                                    </SelectItem>
                                    <SelectItem value="gemini-3-flash">
                                        gemini-3-flash
                                    </SelectItem>
                                    <SelectItem value="gemma-3-12b-it">
                                        gemma-3-12b-it
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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
