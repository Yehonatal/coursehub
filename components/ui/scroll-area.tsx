import * as React from "react";
import { cn } from "@/utils/cn";

export const ScrollArea = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "overflow-y-auto overscroll-contain h-full",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});
ScrollArea.displayName = "ScrollArea";

export default ScrollArea;
