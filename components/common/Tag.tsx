"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface TagProps {
    text: string;
    className?: string;
    small?: boolean;
}

export function Tag({ text, className = "", small = false }: TagProps) {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/resources?q=${encodeURIComponent(text)}`);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`px-3 cursor-pointer py-1 rounded-full font-bold text-[10px] ${
                small ? "px-2 py-0.5 text-xs" : ""
            } bg-muted/50 text-muted-foreground border border-border/50 hover:bg-muted/70 active:scale-95 transition-transform ${className}`}
            aria-label={`Search for tag ${text}`}
        >
            {text}
        </button>
    );
}
