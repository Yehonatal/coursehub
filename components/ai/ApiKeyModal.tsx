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
import { Key, Sparkles, ExternalLink, CheckCircle2, X } from "lucide-react";

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
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
                <div className="p-8 space-y-6">
                    <DialogHeader className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-primary">
                                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 fill-primary/20" />
                                </div>
                                <DialogTitle className="text-2xl font-serif font-semibold tracking-tight">
                                    AI Configuration
                                </DialogTitle>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full hover:bg-primary/5 text-muted-foreground/40 hover:text-primary transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                            Enter your Google Gemini API key to unlock powerful
                            AI features. Your key is stored securely in your
                            browser's local storage.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Step-by-step guide */}
                    <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 space-y-4">
                        <h4 className="text-xs font-bold text-primary/70 uppercase tracking-wider flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            How to get your key
                        </h4>
                        <ol className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-primary/80 font-medium">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold">
                                    1
                                </span>
                                <span>
                                    Visit{" "}
                                    <a
                                        href="https://aistudio.google.com/app/apikey"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary underline decoration-primary/30 hover:decoration-primary transition-all inline-flex items-center gap-1"
                                    >
                                        Google AI Studio{" "}
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-primary/80 font-medium">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold">
                                    2
                                </span>
                                <span>
                                    Click on{" "}
                                    <span className="font-bold text-primary">
                                        "Create API key"
                                    </span>
                                </span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-primary/80 font-medium">
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold">
                                    3
                                </span>
                                <span>Copy the key and paste it below</span>
                            </li>
                        </ol>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2.5">
                            <Label
                                htmlFor="apiKey"
                                className="text-sm font-medium text-primary/80 ml-1"
                            >
                                API Key
                            </Label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                                <Input
                                    id="apiKey"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    className="h-12 pl-11 rounded-xl border-border/50 bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all"
                                    placeholder="AIzaSy..."
                                    type="password"
                                />
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <Label
                                htmlFor="model"
                                className="text-sm font-medium text-primary/80 ml-1"
                            >
                                Preferred Model
                            </Label>
                            <Select
                                defaultValue={model}
                                value={model}
                                onValueChange={(v) => setModel(v)}
                            >
                                <SelectTrigger className="h-12 rounded-xl border-border/50 bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all">
                                    <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/50 shadow-xl">
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

                    <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!key}
                            className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/10 transition-all"
                        >
                            Save Configuration
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
