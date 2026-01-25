"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, BookOpen } from "lucide-react";
import { cn } from "@/utils/cn";

export function ModeToggle() {
    const pathname = usePathname();
    const router = useRouter();
    const isStudyMode = pathname?.startsWith("/study");

    return (
        <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-transparent hover:border-border/40 transition-all mr-4">
            <button
                onClick={() => router.push("/dashboard")}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300",
                    !isStudyMode
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
                )}
            >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden lg:inline">Explore</span>
            </button>
            <button
                onClick={() => router.push("/study/dashboard")}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300",
                    isStudyMode
                        ? "bg-background text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
                )}
            >
                <BookOpen className="w-4 h-4" />
                <span className="hidden lg:inline">Focus</span>
            </button>
        </div>
    );
}
