import React from "react";
import { FilterSection } from "./FilterSection";
import { DateRangeFilter } from "./DateRangeFilter";

export function FilterSidebar() {
    return (
        <div className="space-y-8 w-full">
            <div>
                <h2 className="font-bold text-[#0A251D] mb-4">Filter By</h2>
                <DateRangeFilter />
            </div>

            <FilterSection
                title="Rating"
                options={[
                    { id: "rating-4", label: "> 4" },
                    { id: "rating-3", label: "> 3" },
                ]}
            />

            <FilterSection
                title=""
                options={[
                    { id: "verified", label: "Only verified" },
                    { id: "no-ai", label: "No AI tags" },
                ]}
            />

            <FilterSection
                title="University"
                options={[
                    { id: "hru", label: "Haramaya University" },
                    { id: "hu", label: "Hawassa University" },
                    { id: "amu", label: "Arba Minch University" },
                    { id: "hru-2", label: "Haramaya University" },
                ]}
                showMore
            />

            <FilterSection
                title="Type of Resource"
                options={[
                    { id: "slide", label: "Slide" },
                    { id: "knowledge-graph", label: "Knowledge graph" },
                    { id: "note", label: "Note" },
                ]}
                showMore
            />
        </div>
    );
}
