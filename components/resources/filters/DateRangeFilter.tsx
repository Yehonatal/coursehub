"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function DateRangeFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dateRange = searchParams.get("dateRange") || "all";

    const handleValueChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all") {
            params.set("dateRange", value);
        } else {
            params.delete("dateRange");
        }
        router.replace(`/resources?${params.toString()}`, { scroll: false });
    };

    return (
        <Select value={dateRange} onValueChange={handleValueChange}>
            <SelectTrigger className="w-full bg-muted/50 border-none text-foreground font-medium">
                <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Date Range</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
        </Select>
    );
}
