"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Search,
    Grid,
    LogOut,
    Settings,
    HelpCircle,
    Globe,
    FileText,
    Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from "@/components/providers/UserProvider";
import { error } from "@/lib/logger";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            const res = await fetch("/api/auth/signout", { method: "POST" });
            if (!res.ok) {
                error("Sign out API responded with non-ok status");
            }
        } catch (err) {
            error("Sign out failed:", err);
        } finally {
            // Ensure local navigation happens regardless
            router.push("/login");
            router.refresh();
        }
    };

    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0A251D] text-white">
                            <span className="text-lg font-serif font-bold">
                                H
                            </span>
                        </div>
                        <span className="hidden md:block text-lg font-serif font-extralight text-[#0A251D]">
                            COURSE HUB
                        </span>
                    </Link>
                </div>

                <div className="flex-1 max-w-xl mx-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search"
                            className="w-full pl-10 bg-muted/50 border-transparent focus:bg-white transition-colors rounded-full"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/ai"
                        className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-white/80 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A251D] focus-visible:ring-offset-2 transition"
                        aria-label="Open AI workspace"
                    >
                        <Sparkles className="h-5 w-5 text-primary" />
                    </Link>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden border border-border focus:outline-none focus:ring-2 focus:ring-[#0A251D] focus:ring-offset-2 transition-all"
                        >
                            <Image
                                src="https://github.com/shadcn.png"
                                alt="User"
                                width={32}
                                height={32}
                                className="h-full w-full object-cover"
                            />
                        </button>

                        {isMenuOpen && (
                            <Card className="absolute right-0 rounded-xl top-full mt-2 w-72 p-2 z-50 shadow-sm border-border/60 animate-in fade-in zoom-in-95 duration-200 bg-white">
                                <div className="p-2 flex items-start gap-3 mb-2">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden shrink-0 relative">
                                        <Image
                                            src="https://github.com/shadcn.png"
                                            alt="User"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-[#0A251D] truncate">
                                            {user
                                                ? `${user.first_name} ${user.last_name}`
                                                : "Guest"}
                                        </h4>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {user?.role || "Visitor"} |{" "}
                                            {user?.university ||
                                                "No University"}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-2 mb-2">
                                    <Link
                                        href="/dashboard/profile"
                                        className="block"
                                    >
                                        <Button
                                            variant="outline"
                                            className="w-full rounded-full text-[#0A251D] border-[#0A251D] hover:bg-[#0A251D]/5 h-8 text-xs font-medium"
                                        >
                                            View Profile
                                        </Button>
                                    </Link>
                                </div>

                                <div className="h-px bg-border/40 my-1" />

                                <div className="py-1">
                                    <h5 className="px-2 py-1 text-xs font-bold text-[#0A251D]">
                                        Account
                                    </h5>
                                    <button className="w-full text-left px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 rounded-md flex items-center gap-2 transition-colors">
                                        <div className="h-4 w-4 rounded bg-yellow-400/20 flex items-center justify-center">
                                            <div className="h-2 w-2 bg-yellow-500 rounded-sm" />
                                        </div>
                                        Try Premium for free
                                    </button>
                                    <button className="w-full text-left px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 rounded-md flex items-center gap-2 transition-colors">
                                        <Settings className="h-4 w-4" />{" "}
                                        Settings & Privacy
                                    </button>
                                    <button className="w-full text-left px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 rounded-md flex items-center gap-2 transition-colors">
                                        <HelpCircle className="h-4 w-4" /> Help
                                    </button>
                                    <button className="w-full text-left px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 rounded-md flex items-center gap-2 transition-colors">
                                        <Globe className="h-4 w-4" /> Language
                                    </button>
                                </div>

                                <div className="h-px bg-border/40 my-1" />

                                <div className="py-1">
                                    <h5 className="px-2 py-1 text-xs font-bold text-[#0A251D]">
                                        Manage
                                    </h5>
                                    <button className="w-full text-left px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 rounded-md flex items-center gap-2 transition-colors">
                                        <FileText className="h-4 w-4" /> Posts &
                                        Activity
                                    </button>
                                </div>

                                <div className="h-px bg-border/40 my-1" />

                                <div className="py-1">
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 rounded-md flex items-center gap-2 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" /> Sign Out
                                    </button>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
