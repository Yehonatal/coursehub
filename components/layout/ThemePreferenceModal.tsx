"use client";

import React from "react";
import {
    X,
    Check,
    Sun,
    Moon,
    Droplets,
    Trees,
    Monitor,
    Leaf,
    Github,
    Code,
    Type,
    Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/utils/cn";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ThemePreferenceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const themes = [
    {
        id: "default",
        name: "Classic Cream",
        description: "Warm cream and deep green",
        icon: Sun,
        color: "bg-[#FDFBF7]",
        borderColor: "border-[#0F393B]",
    },
    {
        id: "ocean",
        name: "Ocean Breeze",
        description: "Fresh blue and soft white",
        icon: Droplets,
        color: "bg-blue-50",
        borderColor: "border-blue-500",
    },
    {
        id: "midnight",
        name: "Midnight",
        description: "Deep blue and neon accents",
        icon: Moon,
        color: "bg-[#0F172A]",
        borderColor: "border-blue-400",
    },
    {
        id: "forest",
        name: "Deep Forest",
        description: "Dark green and earthy tones",
        icon: Trees,
        color: "bg-[#061A11]",
        borderColor: "border-emerald-500",
    },
    {
        id: "dark",
        name: "Standard Dark",
        description: "Neutral dark mode",
        icon: Monitor,
        color: "bg-[#121212]",
        borderColor: "border-zinc-700",
    },
    {
        id: "earth",
        name: "Earthy Tones",
        description: "Warm browns and greens",
        icon: Leaf,
        color: "bg-[#F5F5DC]",
        borderColor: "border-orange-800",
    },
    {
        id: "github",
        name: "GitHub Style",
        description: "Clean developer aesthetic",
        icon: Github,
        color: "bg-white",
        borderColor: "border-zinc-200",
    },
    {
        id: "pink",
        name: "Elegant Pink",
        description: "Soft rose and modern accents",
        icon: Heart,
        color: "bg-[#FFF5F7]",
        borderColor: "border-pink-300",
    },
] as const;

const fonts = [
    { name: "Geist Sans", value: "var(--font-geist-sans)" },
    { name: "Playfair Display", value: "var(--font-playfair)" },
    { name: "Inter", value: "var(--font-inter)" },
    { name: "Lora", value: "var(--font-lora)" },
    { name: "Fira Code", value: "var(--font-fira-code)" },
    { name: "System Sans", value: "system-ui, sans-serif" },
    { name: "System Serif", value: "serif" },
    { name: "System Mono", value: "monospace" },
];

export function ThemePreferenceModal({
    isOpen,
    onClose,
}: ThemePreferenceModalProps) {
    const { theme, setTheme, preferences, updatePreference } = useTheme();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl max-h-[90vh] flex flex-col">
                <div className="p-8 space-y-6 overflow-y-auto flex-1">
                    <DialogHeader className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-primary">
                                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                    <Sun className="h-5 w-5 fill-primary/20" />
                                </div>
                                <DialogTitle className="text-2xl font-serif font-semibold tracking-tight">
                                    Appearance
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
                            Customize your experience with different themes and
                            styles.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-8">
                        <section className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
                                Theme Presets
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {themes.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTheme(t.id)}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left group",
                                            theme === t.id
                                                ? "border-primary bg-primary/5 shadow-lg shadow-primary/5"
                                                : "border-border/40 hover:border-primary/30 hover:bg-muted/5"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "h-12 w-12 rounded-xl flex items-center justify-center shadow-inner shrink-0",
                                                t.color,
                                                t.borderColor,
                                                "border"
                                            )}
                                        >
                                            <t.icon
                                                className={cn(
                                                    "h-6 w-6",
                                                    theme === t.id
                                                        ? "text-primary"
                                                        : "text-muted-foreground/60 group-hover:text-primary/60"
                                                )}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-primary truncate">
                                                {t.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {t.description}
                                            </p>
                                        </div>
                                        {theme === t.id && (
                                            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white animate-in zoom-in duration-300 shrink-0">
                                                <Check className="h-4 w-4" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
                                Fine-tune Styles
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-medium">
                                        Base Font Size ({preferences.fontSize}
                                        px)
                                    </Label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="20"
                                        step="1"
                                        value={preferences.fontSize}
                                        onChange={(e) =>
                                            updatePreference(
                                                "fontSize",
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-medium">
                                        Corner Radius ({preferences.radius}rem)
                                    </Label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="2"
                                        step="0.125"
                                        value={preferences.radius}
                                        onChange={(e) =>
                                            updatePreference(
                                                "radius",
                                                parseFloat(e.target.value)
                                            )
                                        }
                                        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-medium">
                                        Border Width ({preferences.borderWidth}
                                        px)
                                    </Label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="4"
                                        step="0.5"
                                        value={preferences.borderWidth}
                                        onChange={(e) =>
                                            updatePreference(
                                                "borderWidth",
                                                parseFloat(e.target.value)
                                            )
                                        }
                                        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-medium">
                                        Shadow Intensity (
                                        {preferences.shadowIntensity})
                                    </Label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="2"
                                        step="0.1"
                                        value={preferences.shadowIntensity}
                                        onChange={(e) =>
                                            updatePreference(
                                                "shadowIntensity",
                                                parseFloat(e.target.value)
                                            )
                                        }
                                        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-medium">
                                        Heading Font
                                    </Label>
                                    <Select
                                        value={preferences.headingFont}
                                        onValueChange={(v) =>
                                            updatePreference("headingFont", v)
                                        }
                                    >
                                        <SelectTrigger className="w-full rounded-xl border-border/40">
                                            <SelectValue placeholder="Select font" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fonts.map((f) => (
                                                <SelectItem
                                                    key={f.value}
                                                    value={f.value}
                                                >
                                                    {f.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-medium">
                                        Body Font
                                    </Label>
                                    <Select
                                        value={preferences.bodyFont}
                                        onValueChange={(v) =>
                                            updatePreference("bodyFont", v)
                                        }
                                    >
                                        <SelectTrigger className="w-full rounded-xl border-border/40">
                                            <SelectValue placeholder="Select font" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fonts.map((f) => (
                                                <SelectItem
                                                    key={f.value}
                                                    value={f.value}
                                                >
                                                    {f.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="p-6 border-t border-border/50 bg-muted/5 flex items-center justify-end">
                    <Button
                        onClick={onClose}
                        className="rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/10 transition-all px-8"
                    >
                        Done
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
