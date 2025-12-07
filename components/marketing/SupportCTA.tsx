import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function SupportCTA() {
    return (
        <div
            className="my-32 bg-[#F5F2EB] rounded-3xl p-12 text-center max-w-4xl mx-auto"
            data-aos="fade-up"
        >
            <h2 className="text-3xl font-serif font-medium mb-4 text-[#0A251D]">
                Still have questions?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Can not find the answer you are looking for? Please chat to our
                friendly team.
            </p>
            <Link href="mailto:support@coursehub.et">
                <Button className="rounded-full px-8 h-12 text-base">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Support
                </Button>
            </Link>
        </div>
    );
}
