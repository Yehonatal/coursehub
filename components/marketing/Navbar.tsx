import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-20 items-center justify-between px-4 md:px-6 mx-auto">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0A251D] text-white">
                            <span className="text-lg font-serif font-bold">
                                H
                            </span>
                        </div>
                        <span>CourseHub</span>
                    </Link>
                </div>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link
                        href="/features"
                        className="transition-colors hover:text-primary"
                    >
                        Features
                    </Link>
                    <Link
                        href="/community"
                        className="transition-colors hover:text-primary"
                    >
                        Community
                    </Link>
                    <Link
                        href="/pricing"
                        className="transition-colors hover:text-primary"
                    >
                        Pricing
                    </Link>
                    <Link
                        href="/faq"
                        className="transition-colors hover:text-primary"
                    >
                        FAQ
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button
                            variant="ghost"
                            className="text-base font-medium hover:bg-transparent hover:text-primary"
                        >
                            Log in
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button className="rounded-md px-6 bg-[#0A251D] text-white hover:bg-[#0A251D]/90">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
