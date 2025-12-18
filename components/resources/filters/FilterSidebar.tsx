"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterSection } from "./FilterSection";
import { DateRangeFilter } from "./DateRangeFilter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Local state for text inputs to avoid lag
    const [localCourseCode, setLocalCourseCode] = useState(
        searchParams.get("courseCode") || ""
    );
    const [localSemester, setLocalSemester] = useState(
        searchParams.get("semester") || ""
    );
    const [localTags, setLocalTags] = useState(searchParams.get("tags") || "");

    const university = searchParams.get("university") || "";
    const resourceType = searchParams.get("resourceType") || "";

    // Update local state when searchParams change (e.g. on back button)
    useEffect(() => {
        setLocalCourseCode(searchParams.get("courseCode") || "");
        setLocalSemester(searchParams.get("semester") || "");
        setLocalTags(searchParams.get("tags") || "");
    }, [searchParams]);

    const updateFilter = useCallback(
        (key: string, value: string | undefined) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            // Use replace instead of push for smoother filtering experience
            // and to avoid cluttering history
            startTransition(() => {
                router.replace(`/resources?${params.toString()}`, {
                    scroll: false,
                });
            });
        },
        [router, searchParams]
    );

    // Debounced updates for text inputs
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localCourseCode !== (searchParams.get("courseCode") || "")) {
                updateFilter("courseCode", localCourseCode);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [localCourseCode, updateFilter, searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSemester !== (searchParams.get("semester") || "")) {
                updateFilter("semester", localSemester);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [localSemester, updateFilter, searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (localTags !== (searchParams.get("tags") || "")) {
                updateFilter("tags", localTags);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [localTags, updateFilter, searchParams]);

    return (
        <div className="space-y-8 w-full">
            <div className="flex items-center justify-between">
                <h2 className="font-bold text-primary">Filter By</h2>
                {isPending && (
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
            </div>
            <DateRangeFilter />

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label
                        htmlFor="courseCode"
                        className="text-sm font-bold text-foreground"
                    >
                        Course Code
                    </Label>
                    <Input
                        id="courseCode"
                        placeholder="e.g. CS101"
                        value={localCourseCode}
                        onChange={(e) => setLocalCourseCode(e.target.value)}
                        className="bg-muted/5 border-border/40"
                    />
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="semester"
                        className="text-sm font-bold text-foreground"
                    >
                        Semester
                    </Label>
                    <Input
                        id="semester"
                        placeholder="e.g. Semester 1"
                        value={localSemester}
                        onChange={(e) => setLocalSemester(e.target.value)}
                        className="bg-muted/5 border-border/40"
                    />
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="tags"
                        className="text-sm font-bold text-foreground"
                    >
                        Tags (comma separated)
                    </Label>
                    <Input
                        id="tags"
                        placeholder="e.g. Slides, Exam"
                        value={localTags}
                        onChange={(e) => setLocalTags(e.target.value)}
                        className="bg-muted/5 border-border/40"
                    />
                </div>
            </div>

            <FilterSection
                title="University"
                options={[
                    { id: "Haramaya University", label: "Haramaya University" },
                    { id: "Hawassa University", label: "Hawassa University" },
                    {
                        id: "Arba Minch University",
                        label: "Arba Minch University",
                    },
                    {
                        id: "Addis Ababa University",
                        label: "Addis Ababa University",
                    },
                ]}
                selectedId={university}
                onSelect={(id) =>
                    updateFilter("university", id === university ? "" : id)
                }
                showMore
            />

            <FilterSection
                title="Type of Resource"
                options={[
                    { id: "slides", label: "Slides" },
                    { id: "notes", label: "Notes" },
                    { id: "exam", label: "Exam" },
                    { id: "assignment", label: "Assignment" },
                ]}
                selectedId={resourceType}
                onSelect={(id) =>
                    updateFilter("resourceType", id === resourceType ? "" : id)
                }
                showMore
            />
        </div>
    );
}
