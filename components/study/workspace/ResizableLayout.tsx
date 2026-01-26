"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface ResizableLayoutProps {
    leftContent: React.ReactNode;
    rightContent: React.ReactNode;
    initialLeftWidth?: number; // Percentage
    minLeftWidth?: number; // Percentage
    maxLeftWidth?: number; // Percentage
}

export default function ResizableLayout({
    leftContent,
    rightContent,
    initialLeftWidth = 55,
    minLeftWidth = 30,
    maxLeftWidth = 70,
}: ResizableLayoutProps) {
    const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const startResizing = () => {
        setIsDragging(true);
        // Prevent text selection while dragging
        document.body.style.userSelect = "none";
        document.body.style.cursor = "col-resize";
    };

    const stopResizing = () => {
        setIsDragging(false);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
    };

    const resize = (e: MouseEvent) => {
        if (isDragging && containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            const containerLeft =
                containerRef.current.getBoundingClientRect().left;

            // Calculate new width relative to the container
            const newLeftWidthPx = e.clientX - containerLeft;
            let newLeftWidthPct = (newLeftWidthPx / containerWidth) * 100;

            if (newLeftWidthPct < minLeftWidth) newLeftWidthPct = minLeftWidth;
            if (newLeftWidthPct > maxLeftWidth) newLeftWidthPct = maxLeftWidth;

            setLeftWidth(newLeftWidthPct);
        }
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", resize);
            window.addEventListener("mouseup", stopResizing);
        } else {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        }

        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className="flex h-full w-full overflow-hidden bg-background"
        >
            <div style={{ width: `${leftWidth}%` }}>{leftContent}</div>

            <div
                className={cn(
                    "w-1 cursor-col-resize bg-border hover:bg-primary/50 transition-colors z-10 flex flex-col justify-center items-center relative",
                    isDragging && "bg-primary",
                )}
                onMouseDown={startResizing}
            >
                <div className="absolute inset-y-0 -left-1 -right-1 z-10 cursor-col-resize" />
                <div className="h-8 w-1 bg-border rounded-full" />
            </div>

            <div
                className="h-full overflow-hidden flex-1 flex flex-col"
                style={{ width: `${100 - leftWidth}%` }}
            >
                {rightContent}
            </div>
        </div>
    );
}
