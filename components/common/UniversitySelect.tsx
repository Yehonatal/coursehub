"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getUniversities, createUniversity } from "@/app/actions/university";

interface University {
    university_id: number;
    name: string;
    slug: string;
}

interface UniversitySelectProps {
    defaultValue?: string;
    name?: string;
    required?: boolean;
    className?: string;
    error?: string;
    onSelect?: (university: string) => void;
}

// Simple cache to avoid re-fetching universities across multiple instances of the component
let universitiesCache: University[] | null = null;

export function UniversitySelect({
    defaultValue = "",
    name = "university",
    required = false,
    className,
    error,
    onSelect,
}: UniversitySelectProps) {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(defaultValue);
    const [universities, setUniversities] = React.useState<University[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isCreating, setIsCreating] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const fetchUniversities = async () => {
            if (universitiesCache) {
                setUniversities(universitiesCache);
                return;
            }

            setIsLoading(true);
            try {
                const data = await getUniversities();
                universitiesCache = data;
                setUniversities(data);
            } catch (error) {
                console.error("Failed to fetch universities:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUniversities();
    }, []);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredUniversities = React.useMemo(() => {
        if (!inputValue) return universities;
        const search = inputValue.toLowerCase().trim();

        // 1. Priority: Starts with
        const startsWith = universities.filter((u) =>
            u.name.toLowerCase().startsWith(search)
        );

        // 2. Priority: Contains (but doesn't start with)
        const contains = universities.filter(
            (u) =>
                u.name.toLowerCase().includes(search) &&
                !u.name.toLowerCase().startsWith(search)
        );

        const matches = [...startsWith, ...contains];

        if (matches.length > 0) return matches.slice(0, 10);

        // 3. Fallback: Simple fuzzy match (all characters present in order)
        return universities
            .filter((u) => {
                const name = u.name.toLowerCase();
                let i = 0;
                for (const char of search) {
                    i = name.indexOf(char, i);
                    if (i === -1) return false;
                    i++;
                }
                return true;
            })
            .slice(0, 5);
    }, [universities, inputValue]);

    const exactMatch = React.useMemo(() => {
        const search = inputValue.toLowerCase().trim();
        return universities.find((u) => u.name.toLowerCase() === search);
    }, [universities, inputValue]);

    const handleSelect = (universityName: string) => {
        setInputValue(universityName);
        setOpen(false);
        onSelect?.(universityName);
    };

    const handleCreateNew = async () => {
        if (!inputValue.trim() || isCreating) return;

        setIsCreating(true);
        try {
            const result = await createUniversity(inputValue.trim());
            if (result.success && result.university) {
                const newUniv = result.university;
                universitiesCache = [...(universitiesCache || []), newUniv];
                setUniversities(universitiesCache);
                handleSelect(newUniv.name);
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Failed to create university:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className="relative">
                <Input
                    type="text"
                    name={name}
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    placeholder="Search or type university name..."
                    required={required}
                    autoComplete="off"
                    className={cn(
                        "pr-10",
                        className,
                        error && "border-red-500 focus-visible:ring-red-500"
                    )}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <ChevronsUpDown className="h-4 w-4" />
                    )}
                </div>
            </div>

            {open && (inputValue || filteredUniversities.length > 0) && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none animate-in fade-in zoom-in-95 max-h-60 overflow-auto">
                    {filteredUniversities.length > 0 ? (
                        filteredUniversities.map((u) => (
                            <button
                                key={u.university_id}
                                type="button"
                                onClick={() => handleSelect(u.name)}
                                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                            >
                                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                    {inputValue === u.name && (
                                        <Check className="h-4 w-4" />
                                    )}
                                </span>
                                {u.name}
                            </button>
                        ))
                    ) : (
                        <div className="py-2 px-2 text-sm text-muted-foreground text-center">
                            No university found
                        </div>
                    )}

                    {!exactMatch && inputValue.trim() && (
                        <button
                            type="button"
                            onClick={handleCreateNew}
                            disabled={isCreating}
                            className="relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-2 pr-2 text-sm font-medium text-primary outline-none hover:bg-primary/10 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 border-t border-border mt-1"
                        >
                            {isCreating ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Plus className="mr-2 h-4 w-4" />
                            )}
                            Add "{inputValue}"
                        </button>
                    )}
                </div>
            )}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
