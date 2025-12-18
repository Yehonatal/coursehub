import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export function EducatorInvite() {
    return (
        <section className="w-full py-12 bg-background border-b border-border/40">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm border border-border/60 p-2 flex flex-col md:flex-row items-center gap-4">
                    <div className="flex items-center gap-4 px-2 border-b md:border-b-0 md:border-r border-border/60 w-full md:w-auto">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif font-bold text-lg">
                                Educator Portal
                            </span>
                            <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
                                Join Cohort
                            </span>
                        </div>
                    </div>
                    <div className="flex-1 w-full px-4">
                        <input
                            type="text"
                            placeholder="Enter access code..."
                            className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder:text-muted-foreground/60 outline-none text-foreground"
                        />
                    </div>
                    <div className="p-2 w-full md:w-auto">
                        <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 rounded-lg flex items-center gap-2">
                            Link
                        </Button>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
                        Login and associate to a cohort with your access code
                    </p>
                </div>
            </div>
        </section>
    );
}
