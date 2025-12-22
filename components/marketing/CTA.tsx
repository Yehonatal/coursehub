import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
    return (
        <section className="w-full py-24 bg-primary text-primary-foreground">
            <div className="container px-4 md:px-6 mx-auto text-center">
                <div className="max-w-3xl mx-auto space-y-8" data-aos="zoom-in">
                    <h2 className="text-3xl font-serif font-medium tracking-tight sm:text-4xl md:text-5xl">
                        Ready to elevate your academic performance?
                    </h2>
                    <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto">
                        Join our community of students and educators on
                        CourseHub today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link href="/register">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="rounded-full px-8 h-12 text-base font-medium w-full sm:w-auto"
                            >
                                Get Started for Free
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button
                                size="lg"
                                variant="outline"
                                className="rounded-full px-8 h-12 text-base font-medium bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary w-full sm:w-auto"
                            >
                                Contact Support
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
