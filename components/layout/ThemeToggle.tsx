"use client";

import React, { useState } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemePreferenceModal } from "./ThemePreferenceModal";

export function ThemeToggle() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                variant="outline"
                size="icon"
                onClick={() => setIsOpen(true)}
                className="fixed right-6 top-1/2 -translate-y-1/2 md:bottom-6 md:right-6 md:top-auto md:translate-y-0 h-12 w-12 rounded-xl shadow-2xl bg-card/80 backdrop-blur-md border-primary/20 hover:border-primary hover:scale-110 transition-all duration-300 z-50 group"
            >
                <Palette className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform" />
            </Button>

            <ThemePreferenceModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
