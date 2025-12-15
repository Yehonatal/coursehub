"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

const DialogContext = React.createContext<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
}>({
    open: false,
    onOpenChange: () => {},
});

export const Dialog = ({
    children,
    open,
    onOpenChange,
}: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) => {
    const [isOpen, setIsOpen] = React.useState(open || false);

    React.useEffect(() => {
        if (open !== undefined) {
            setIsOpen(open);
        }
    }, [open]);

    const handleOpenChange = (value: boolean) => {
        setIsOpen(value);
        onOpenChange?.(value);
    };

    return (
        <DialogContext.Provider
            value={{ open: isOpen, onOpenChange: handleOpenChange }}
        >
            {children}
        </DialogContext.Provider>
    );
};

export const DialogContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(DialogContext);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onOpenChange(false);
            }
        };
        if (open) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onOpenChange]);

    if (!mounted || !open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in-0"
                onClick={() => onOpenChange(false)}
            />
            <div
                ref={ref}
                className={cn(
                    "relative z-50 grid w-full max-w-lg gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg animate-in fade-in-0 zoom-in-95",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </div>,
        document.body
    );
});
DialogContent.displayName = "DialogContent";

export const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-1.5 text-center sm:text-left",
            className
        )}
        {...props}
    />
);
DialogHeader.displayName = "DialogHeader";

export const DialogTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
DialogDescription.displayName = "DialogDescription";

export const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className
        )}
        {...props}
    />
);
DialogFooter.displayName = "DialogFooter";
