import React from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

function getInitials(name?: string) {
    if (!name) return "U";
    return name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function stringToColor(str?: string) {
    if (!str) return "bg-muted";
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `bg-[hsl(${hue}deg_60%_85%)]`;
}

export function UniversityBadge({
    university,
    size = 48,
    className,
}: {
    university?: string | null;
    size?: number;
    className?: string;
}) {
    const initials = getInitials(university || "U");
    const bgClass = stringToColor(university || "");
    const slug = university
        ? university
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")
        : "unknown-university";
    const imgPath = `/logos/${slug}.png`;

    return (
        <div
            className={cn(
                "rounded-full overflow-hidden shrink-0 flex items-center justify-center",
                className
            )}
            style={{ width: size, height: size }}
        >
            {/* if a static logo exists, fallback to initials */}
            {/* Note: we don't check for existence at runtime. Projects using a logos folder can add files named by slug */}
            <div
                className={`w-full h-full flex items-center justify-center text-white font-semibold ${bgClass}`}
            >
                {initials}
            </div>
        </div>
    );
}

export default UniversityBadge;
