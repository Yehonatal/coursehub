import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FilterOption {
    id: string;
    label: string;
    count?: number;
}

interface FilterSectionProps {
    title: string;
    options: FilterOption[];
    showMore?: boolean;
    selectedId?: string;
    onSelect?: (id: string) => void;
}

export function FilterSection({
    title,
    options,
    showMore,
    selectedId,
    onSelect,
}: FilterSectionProps) {
    return (
        <div className="space-y-3">
            <h3 className="font-bold text-[#0A251D] text-sm">{title}</h3>
            <div className="space-y-2">
                {options.map((option) => (
                    <div
                        key={option.id}
                        className="flex items-center space-x-2"
                    >
                        <Checkbox
                            id={option.id}
                            className="border-gray-300"
                            checked={selectedId === option.id}
                            onCheckedChange={() => onSelect?.(option.id)}
                        />
                        <Label
                            htmlFor={option.id}
                            className="text-sm font-medium text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {option.label}
                        </Label>
                    </div>
                ))}
            </div>
            {showMore && (
                <Button
                    variant="link"
                    className="text-gray-500 text-xs p-0 h-auto font-normal hover:no-underline hover:text-gray-700"
                >
                    show more
                </Button>
            )}
        </div>
    );
}
