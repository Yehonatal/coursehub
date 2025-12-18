"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [user, setUser] = React.useState<{ first_name: string } | null>(null);

    React.useEffect(() => {
        fetch("/api/me")
            .then((res) => res.json())
            .then((data) => setUser(data.user))
            .catch(() => setUser(null));
    }, []);

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    const navLinks = [
        { href: "/features", label: "Features" },
        { href: "/community", label: "Community" },
        { href: "/pricing", label: "Pricing" },
        { href: "/faq", label: "FAQ" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60" />
            <div className="container relative flex h-20 items-center justify-between px-4 md:px-6 mx-auto">
                <div className="flex items-center gap-2 z-50">
                    <Link
                        href="/"
                        className="flex items-center gap-2"
                        onClick={() => setIsOpen(false)}
                    >
                        <div
                            className={cn(
                                "flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-300",
                                isOpen
                                    ? "bg-primary-foreground text-primary"
                                    : "bg-primary text-primary-foreground"
                            )}
                        >
                            <span className="text-lg font-serif font-bold">
                                H
                            </span>
                        </div>
                        <span
                            className={cn(
                                "font-serif font-extralight transition-colors duration-300",
                                isOpen
                                    ? "text-primary-foreground"
                                    : "text-foreground"
                            )}
                        >
                            COURSEHUB
                        </span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="transition-colors hover:text-primary"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-muted-foreground">
                                Signed in as {user.first_name}
                            </span>
                            <Button
                                className="rounded-md px-6 bg-primary text-primary-foreground hover:bg-primary/90"
                                asChild
                            >
                                <Link href="/dashboard">Go to Dashboard</Link>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                className="text-base font-medium hover:bg-transparent hover:text-primary"
                                asChild
                            >
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button
                                className="rounded-md px-6 bg-primary text-primary-foreground hover:bg-primary/90"
                                asChild
                            >
                                <Link href="/register">Get Started</Link>
                            </Button>
                        </>
                    )}
                </div>

                <button
                    className="md:hidden z-50 p-2 -mr-2 text-foreground transition-colors duration-300"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? (
                        <X className="h-6 w-6 text-primary-foreground" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>

                <div
                    className={cn(
                        "fixed inset-0 z-40 bg-primary flex flex-col justify-center px-6 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden",
                        isOpen
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-full pointer-events-none"
                    )}
                >
                    <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-primary-foreground/5 blur-3xl" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[200px] h-[200px] rounded-full bg-primary-foreground/5 blur-3xl" />

                    <nav className="flex flex-col gap-6 relative z-10">
                        {navLinks.map((link, i) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "text-4xl font-serif font-medium text-primary-foreground/90 hover:text-primary-foreground transition-all transform",
                                    isOpen
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"
                                )}
                                style={{
                                    transitionDelay: `${100 + i * 50}ms`,
                                    transitionDuration: "500ms",
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div
                        className={cn(
                            "flex flex-col gap-4 mt-12 relative z-10 transition-all duration-700",
                            isOpen
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                        )}
                        style={{ transitionDelay: "300ms" }}
                    >
                        {user ? (
                            <Button
                                asChild
                                className="w-full h-12 text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full"
                            >
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Go to Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 text-lg border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent rounded-full"
                                    >
                                        Log in
                                    </Button>
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Button className="w-full h-12 text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
