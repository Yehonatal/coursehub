"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Bell, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUser } from "@/components/providers/UserProvider";
import { error } from "@/lib/logger";
import { getUnreadNotificationCount } from "@/app/actions/notifications";
import { UserMenu } from "./UserMenu";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useUser();

    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

    useEffect(() => {
        setSearchQuery(searchParams.get("q") || "");
        setIsSearching(false);
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        if (searchQuery.trim()) {
            router.push(
                `/resources?q=${encodeURIComponent(searchQuery.trim())}`
            );
        } else {
            router.push("/resources");
        }
    };

    useEffect(() => {
        if (user) {
            const fetchUnreadCount = async () => {
                const count = await getUnreadNotificationCount();
                setUnreadCount(count);
            };
            fetchUnreadCount();
            // Refresh count every minute
            const interval = setInterval(fetchUnreadCount, 60000);
            return () => clearInterval(interval);
        }
    }, [user]);

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
        <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="max-w-[1600px] flex h-20 items-center justify-between px-4 md:px-8 mx-auto">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 group"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground group-hover:scale-105 transition-transform duration-300">
                            <span className="text-xl font-serif font-bold">
                                H
                            </span>
                        </div>
                        <span className="hidden md:block text-lg font-serif font-bold text-foreground tracking-tight">
                            COURSE HUB
                        </span>
                    </Link>
                </div>

                <div className="flex-1 max-w-2xl mx-8">
                    <form onSubmit={handleSearch} className="relative group">
                        {isSearching ? (
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                        )}
                        <Input
                            type="search"
                            placeholder="Search for resources, universities, or courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 pl-12 bg-muted/40 border-transparent focus:bg-card focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all duration-300 rounded-2xl text-sm font-medium"
                        />
                    </form>
                </div>

                <div className="flex items-center gap-3 md:gap-5">
                    <Link
                        href="/dashboard/notifications"
                        className="relative h-10 w-10 flex items-center justify-center rounded-xl border border-border/40 bg-card/50 hover:bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                        aria-label="View notifications"
                    >
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border-2 border-card shadow-sm">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </Link>
                    <Link
                        href="/ai"
                        className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-border/40 bg-card/50 hover:bg-card hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                        aria-label="Open AI workspace"
                    >
                        <Sparkles className="h-5 w-5 text-primary" />
                    </Link>

                    <div className="h-8 w-px bg-border/40 mx-1 hidden md:block" />

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="h-10 w-10 rounded-xl bg-muted overflow-hidden border border-border/40 hover:border-primary/40 transition-all duration-300 shadow-sm"
                        >
                            <Image
                                src="https://github.com/shadcn.png"
                                alt="User"
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                            />
                        </button>

                        {isMenuOpen && <UserMenu onSignOut={handleSignOut} />}
                    </div>
                </div>
            </div>
        </header>
    );
}
