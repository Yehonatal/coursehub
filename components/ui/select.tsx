"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface SelectContextType {
    value: string;
    onValueChange: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    labels: Record<string, string>;
    registerLabel: (value: string, label: string) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(
    undefined
);

const Select = ({
    children,
    defaultValue,
    value: controlledValue,
    onValueChange,
}: {
    children: React.ReactNode;
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
}) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
        defaultValue || ""
    );
    const [open, setOpen] = React.useState(false);
    const [labels, setLabels] = React.useState<Record<string, string>>({});

    const value =
        controlledValue !== undefined ? controlledValue : uncontrolledValue;
    const handleValueChange = (newValue: string) => {
        if (controlledValue === undefined) {
            setUncontrolledValue(newValue);
        }
        onValueChange?.(newValue);
    };

    const registerLabel = React.useCallback((val: string, label: string) => {
        setLabels((prev) => ({ ...prev, [val]: label }));
    }, []);

    return (
        <SelectContext.Provider
            value={{
                value,
                onValueChange: handleValueChange,
                open,
                setOpen,
                labels,
                registerLabel,
            }}
        >
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    );
};

const SelectTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectTrigger must be used within Select");

    return (
        <button
            ref={ref}
            type="button"
            onClick={() => context.setOpen(!context.open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectValue must be used within Select");

    const displayValue = context.value
        ? context.labels[context.value] || context.value
        : placeholder;

    return (
        <span ref={ref} className={cn("block truncate", className)} {...props}>
            {displayValue}
        </span>
    );
});
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectContent must be used within Select");

    if (!context.open) return null;

    return (
        <div
            ref={ref}
            className={cn(
                "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80",
                "top-full left-0 w-full mt-1",
                className
            )}
            {...props}
        >
            <div className="p-1">{children}</div>
        </div>
    );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) throw new Error("SelectItem must be used within Select");

    const isSelected = context.value === value;

    // Register label for display
    React.useEffect(() => {
        if (typeof children === "string") {
            context.registerLabel(value, children);
        }
    }, [value, children, context.registerLabel]);

    return (
        <div
            ref={ref}
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground",
                className
            )}
            onClick={(e) => {
                e.stopPropagation();
                context.onValueChange(value);
                context.setOpen(false);
            }}
            {...props}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {isSelected && <Check className="h-4 w-4" />}
            </span>
            <span className="truncate">{children}</span>
        </div>
    );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
