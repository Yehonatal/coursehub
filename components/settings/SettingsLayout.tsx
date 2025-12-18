"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import {
    User,
    Shield,
    Lock,
    Bell,
    Key,
    CreditCard,
    Settings as SettingsIcon,
} from "lucide-react";

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [activeSection, setActiveSection] = useState("account");

    const sections = [
        { id: "account", label: "Account", icon: User },
        { id: "security", label: "Security", icon: Shield },
        { id: "privacy", label: "Privacy", icon: Lock },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "api", label: "API Keys", icon: Key },
        { id: "billing", label: "Billing", icon: CreditCard },
    ];

    useEffect(() => {
        const sections = [
            { id: "account", label: "Account", icon: User },
            { id: "security", label: "Security", icon: Shield },
            { id: "privacy", label: "Privacy", icon: Lock },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "api", label: "API Keys", icon: Key },
            { id: "billing", label: "Billing", icon: CreditCard },
        ];

        const handleHashChange = () => {
            const hash = window.location.hash.replace("#", "");
            if (hash && sections.some((s) => s.id === hash)) {
                setActiveSection(hash);
            }
        };

        handleHashChange();
        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
            <div className="flex flex-col md:flex-row gap-16">
                <aside className="w-full md:w-64 shrink-0 hidden md:block">
                    <div className="sticky top-28">
                        <div className="flex items-center gap-3 mb-10 px-2">
                            <div className="h-9 w-9 rounded-xl bg-primary/5 flex items-center justify-center">
                                <SettingsIcon className="w-4.5 h-4.5 text-primary/70" />
                            </div>
                            <h1 className="text-2xl font-serif font-semibold text-primary tracking-tight">
                                Settings
                            </h1>
                        </div>
                        <nav className="space-y-1.5">
                            {sections.map((s) => {
                                const Icon = s.icon;
                                return (
                                    <Link
                                        key={s.id}
                                        href={`#${s.id}`}
                                        onClick={() => setActiveSection(s.id)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300",
                                            activeSection === s.id
                                                ? "bg-primary text-white shadow-sm"
                                                : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                "w-4 h-4",
                                                activeSection === s.id
                                                    ? "text-white"
                                                    : "text-muted-foreground/60"
                                            )}
                                        />
                                        {s.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                <main className="flex-1 min-w-0">
                    <div className="max-w-3xl space-y-20">{children}</div>
                </main>
            </div>
        </div>
    );
}
