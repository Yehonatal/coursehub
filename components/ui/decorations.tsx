import React from "react";
import { cn } from "@/utils/cn";

export function HandDrawnCircle({
    children,
    className,
    strokeWidth = 4,
}: {
    children: React.ReactNode;
    className?: string;
    strokeWidth?: number;
}) {
    return (
        <span className="relative inline-block whitespace-nowrap">
            <span className="relative z-10">{children}</span>
            <svg
                className={cn(
                    "absolute -top-[20%] -left-[10%] w-[120%] h-[140%] pointer-events-none select-none",
                    className
                )}
                viewBox="0 0 200 100"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M185.5 45.5C185.5 75.5 145.5 92.5 95.5 92.5C45.5 92.5 10.5 75.5 10.5 45.5C10.5 15.5 45.5 5.5 95.5 5.5C145.5 5.5 185.5 15.5 185.5 45.5Z"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    className="opacity-80"
                />
                <path
                    d="M190 48C190 76 148 95 98 95C48 95 5 76 5 48C5 20 48 3 98 3C148 3 190 20 190 48Z"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    className="opacity-60"
                    style={{
                        transform: "rotate(-1deg)",
                        transformOrigin: "center",
                    }}
                />
            </svg>
        </span>
    );
}

export function HandDrawnUnderline({
    children,
    className,
    strokeWidth = 24,
}: {
    children: React.ReactNode;
    className?: string;
    strokeWidth?: number;
}) {
    return (
        <span className="relative inline-block whitespace-nowrap">
            <span className="relative z-10">{children}</span>
            <svg
                className={cn(
                    "absolute  -bottom-0.5 left-0  w-full h-4 pointer-events-none select-none",
                    className
                )}
                viewBox="0 0 200 20"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M5 12 L 195 12"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
        </span>
    );
}

export function HandDrawnBox({
    children,
    className,
    strokeWidth = 4,
}: {
    children: React.ReactNode;
    className?: string;
    strokeWidth?: number;
}) {
    return (
        <span className="relative inline-block whitespace-nowrap">
            <span className="relative z-10">{children}</span>
            <svg
                className={cn(
                    "absolute -top-[10%] -left-[5%] w-[110%] h-[120%] pointer-events-none select-none",
                    className
                )}
                viewBox="0 0 200 100"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M10 10 C 60 8 140 12 190 10 C 192 40 188 60 190 90 C 140 92 60 88 10 90 C 8 60 12 40 10 10 Z"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    className="opacity-80"
                />
                <path
                    d="M12 12 C 62 10 142 14 188 12 C 190 42 186 62 188 88 C 138 90 58 86 12 88 C 10 62 14 42 12 12 Z"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    className="opacity-60"
                    style={{
                        transform: "rotate(-0.5deg)",
                        transformOrigin: "center",
                    }}
                />
            </svg>
        </span>
    );
}
