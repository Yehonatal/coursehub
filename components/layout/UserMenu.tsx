"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
    LogOut,
    Settings,
    FileText,
    User,
    ChevronRight,
    Crown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/components/providers/UserProvider";

interface UserMenuProps {
    onSignOut: () => void;
}

export function UserMenu({ onSignOut }: UserMenuProps) {
    const { user } = useUser();
    const displayName = user ? `${user.first_name} ${user.last_name}` : "Guest";
    const displayAvatar = "https://github.com/shadcn.png";

    return (
        <Card className="absolute right-0 top-full mt-4 w-80 p-3 z-50 shadow-2xl shadow-primary/10 border-border/40 animate-in fade-in zoom-in-95 duration-200 bg-white rounded-[1.5rem] overflow-hidden">
            {/* Profile Section */}
            <div className="p-3 flex items-center gap-4 mb-2 bg-muted/30 rounded-2xl border border-border/40">
                <div className="h-14 w-14 rounded-full bg-muted overflow-hidden shrink-0 relative border-2 border-white shadow-sm">
                    <Image
                        src={displayAvatar}
                        alt={displayName}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-primary truncate text-base">
                        {displayName}
                    </h4>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider truncate">
                        {user?.role || "Student"} •{" "}
                        {user?.university || "No University"}
                    </p>
                </div>
            </div>

            <div className="px-1 mb-4">
                <Button
                    asChild
                    className="w-full rounded-xl bg-primary text-white hover:bg-primary/90 h-10 text-xs font-bold shadow-lg shadow-primary/20"
                >
                    <Link
                        href="/dashboard/profile"
                        className="flex items-center justify-center gap-2"
                    >
                        <User className="h-3.5 w-3.5" />
                        View Full Profile
                    </Link>
                </Button>
            </div>

            <div className="space-y-1">
                <p className="px-3 py-1 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                    Account Settings
                </p>

                <button className="w-full group flex items-center justify-between p-2.5 rounded-xl hover:bg-primary/5 transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                            <Crown className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-primary">
                                Try Premium
                            </p>
                            <p className="text-[10px] text-muted-foreground/60 font-medium">
                                Unlock AI features
                            </p>
                        </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </button>

                <Link
                    href="/dashboard/settings"
                    className="w-full group flex items-center justify-between p-2.5 rounded-xl hover:bg-primary/5 transition-all duration-300"
                >
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                            <Settings className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-bold text-primary">
                            Settings & Privacy
                        </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </Link>
            </div>

            <div className="h-px bg-border/40 my-3 mx-2" />

            <div className="space-y-1">
                <p className="px-3 py-1 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                    Activity
                </p>
                <button className="w-full group flex items-center justify-between p-2.5 rounded-xl hover:bg-primary/5 transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                            <FileText className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-bold text-primary">
                            Posts & Activity
                        </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </button>
            </div>

            <div className="mt-4 pt-2 border-t border-border/40">
                <button
                    onClick={onSignOut}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300 font-bold text-sm"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </Card>
    );
}
