import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-[#F5F2EB]">
            <div className="container flex flex-col gap-10 py-12 md:py-16 px-4 md:px-6 mx-auto">
                <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
                    <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
                        <h3
                            className={
                                "font-serif text-2xl font-extralight transition-colors duration-300"
                            }
                        >
                            COURSEHUB
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            Centralized adaptive learning platform for Ethiopian
                            university students. Empowering the next generation
                            of scholars.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-base font-serif font-bold text-foreground">
                            Product
                        </h3>
                        <Link
                            href="/features"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Features
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/community"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Community
                        </Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-base font-serif font-bold text-foreground">
                            Support
                        </h3>
                        <Link
                            href="/faq"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            FAQ
                        </Link>
                        <Link
                            href="/contact"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Contact
                        </Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-base font-serif font-bold text-foreground">
                            Legal
                        </h3>
                        <Link
                            href="/privacy"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            Terms
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-8 border-t border-border/20">
                    <p className="text-xs text-muted-foreground">
                        © 2025 CourseHub. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
