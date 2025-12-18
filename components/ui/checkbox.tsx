"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

const Checkbox = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        onCheckedChange?: (checked: boolean) => void;
        checked?: boolean;
    }
>(({ className, checked, onCheckedChange, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(false);

    const isChecked = checked !== undefined ? checked : internalChecked;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (checked === undefined) {
            setInternalChecked(!internalChecked);
        }
        onCheckedChange?.(!isChecked);
        props.onClick?.(e);
    };

    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={isChecked}
            ref={ref}
            className={cn(
                "peer h-4 w-4 shrink-0 rounded-md border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                isChecked
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent",
                className
            )}
            onClick={handleClick}
            {...props}
        >
            <div
                className={cn(
                    "flex items-center justify-center text-current",
                    !isChecked && "hidden"
                )}
            >
                <Check className="h-3 w-3 stroke-[3]" />
            </div>
        </button>
    );
});
Checkbox.displayName = "Checkbox";

export { Checkbox };
