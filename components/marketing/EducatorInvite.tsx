import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export function EducatorInvite() {
    return (
        <section className="w-full py-12 bg-background border-b border-border/40">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm border border-border/60 p-4 md:p-6 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-4 items-center">
                    <div className="flex items-center gap-4 px-2  border-border/60 w-full md:w-auto">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif font-bold text-lg">
                                Educator Access
                            </span>
                            <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
                                Request Free Pro Access
                            </span>
                        </div>
                    </div>

                    <div className="px-2 w-full">
                        <input
                            className="w-full bg-transparent border-none rounded px-3 py-2 text-sm focus:ring-0 outline-none placeholder:text-muted-foreground/60"
                            placeholder="Email"
                            type="email"
                            aria-label="Contact email"
                        />
                    </div>

                    <div className="p-2 w-full md:w-auto flex items-center justify-center md:flex-col md:items-center">
                        <Button
                            type="button"
                            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 rounded-lg"
                        >
                            Request Free Pro Access
                        </Button>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                            Requests are reviewed within 3-5 business days.
                        </p>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
                        Prefer to contact us directly?{" "}
                        <a
                            href="mailto:support@coursehub.org"
                            className="underline"
                        >
                            support@coursehub.org
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
