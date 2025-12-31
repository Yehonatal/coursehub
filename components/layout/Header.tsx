"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Bell, Search, Sparkles, GraduationCap, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUser } from "@/components/providers/UserProvider";
import { error } from "@/lib/logger";
import { api } from "@/lib/api-client";
import { getUnreadNotificationCount } from "@/app/actions/notifications";
import { UserMenu } from "./UserMenu";
import { useDebounce } from "@/hooks/useDebounce";
import { globalSearch, type SearchResult } from "@/app/actions/search";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useUser();

    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const debouncedQuery = useDebounce(searchQuery, 300);
    const cache = useRef<Record<string, SearchResult[]>>({});

    useEffect(() => {
        setSearchQuery(searchParams.get("q") || "");
        setIsSearching(false);
        setShowResults(false);
    }, [searchParams]);

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            setShowResults(false);
            return;
        }

        if (cache.current[debouncedQuery]) {
            setResults(cache.current[debouncedQuery]);
            setShowResults(true);
            return;
        }

        const performSearch = async () => {
            setIsSearching(true);
            try {
                const data = await globalSearch(debouncedQuery);
                cache.current[debouncedQuery] = data;
                setResults(data);
                setShowResults(true);
            } catch (err) {
                error("Search failed:", err);
            } finally {
                setIsSearching(false);
            }
        };

        performSearch();
    }, [debouncedQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowResults(false);
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
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            const json = await api.auth.signOut();
            if (!json.success) {
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
        <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl max-w-[1500] mx-auto">
            <div className="flex h-20 items-center justify-between px-4 md:px-8 mx-auto">
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

                <div className="flex-1 max-w-2xl mx-8 relative" ref={searchRef}>
                    <form onSubmit={handleSearch} className="relative group">
                        {isSearching ? (
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 border border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                        )}
                        <Input
                            type="search"
                            placeholder="Search (e.g. '@haramaya programming') — resources, universities, or courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() =>
                                searchQuery.trim() && setShowResults(true)
                            }
                            className="w-full h-12 pl-12 bg-muted/40 border-transparent focus:bg-card focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all duration-300 rounded-2xl text-sm font-medium"
                        />
                    </form>

                    {showResults && (results.length > 0 || isSearching) && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            <div className="max-h-[400px] overflow-y-auto p-2">
                                {isSearching && results.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        Searching...
                                    </div>
                                ) : results.length > 0 ? (
                                    <div className="space-y-1">
                                        {results.map((result) => (
                                            <Link
                                                key={`${result.type}-${result.id}`}
                                                href={result.url}
                                                onClick={() =>
                                                    setShowResults(false)
                                                }
                                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                                            >
                                                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-muted group-hover:bg-background transition-colors">
                                                    {result.type ===
                                                    "university" ? (
                                                        <GraduationCap className="h-5 w-5 text-primary" />
                                                    ) : (
                                                        <BookOpen className="h-5 w-5 text-blue-500" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-foreground truncate">
                                                        {result.title}
                                                    </p>
                                                    {result.subtitle && (
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {result.subtitle}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40 group-hover:text-primary/40 transition-colors">
                                                    {result.type}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No results found for "{searchQuery}"
                                    </div>
                                )}
                            </div>
                            {results.length > 0 && (
                                <div className="p-2 border-t border-border/50 bg-muted/20">
                                    <button
                                        onClick={handleSearch}
                                        className="w-full py-2 text-xs font-medium text-primary hover:underline"
                                    >
                                        View all results
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
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
                                src={
                                    user?.profile_image_url ||
                                    "https://github.com/shadcn.png"
                                }
                                alt={
                                    user
                                        ? `${user.first_name} ${user.last_name}`
                                        : "User"
                                }
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
