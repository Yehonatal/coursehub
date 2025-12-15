"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

interface StarRatingProps {
    value: number;
    onChange?: (value: number) => void;
    readOnly?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function StarRating({
    value,
    onChange,
    readOnly = false,
    size = "md",
    className,
}: StarRatingProps) {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const displayValue = hoverValue ?? value;

    const handleMouseEnter = (star: number) => {
        if (!readOnly) {
            setHoverValue(star);
        }
    };

    const handleMouseLeave = () => {
        if (!readOnly) {
            setHoverValue(null);
        }
    };

    const handleClick = (star: number) => {
        if (!readOnly && onChange) {
            onChange(star);
        }
    };

    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    };

    return (
        <div
            className={cn("flex items-center gap-1", className)}
            onMouseLeave={handleMouseLeave}
        >
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    className={cn(
                        "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0E7490] rounded-sm",
                        readOnly ? "cursor-default" : "cursor-pointer"
                    )}
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => handleMouseEnter(star)}
                    disabled={readOnly}
                    aria-label={`Rate ${star} stars`}
                >
                    <Star
                        className={cn(
                            sizeClasses[size],
                            star <= Math.round(displayValue)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                        )}
                    />
                </button>
            ))}
        </div>
    );
}
