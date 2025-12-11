import { Hero } from "@/components/marketing/Hero";
import { EducatorInvite } from "@/components/marketing/EducatorInvite";
import { TrustedBy } from "@/components/marketing/TrustedBy";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { FeaturesGrid } from "@/components/marketing/FeaturesGrid";
import { CTA } from "@/components/marketing/CTA";
import { validateRequest } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function LandingPage() {
    let user = null;
    try {
        const result = await validateRequest();
        user = result.user;
    } catch (error) {
        // Ignore session validation errors on landing page
    }

    if (user) {
        redirect("/dashboard");
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            <Hero />
            <EducatorInvite />
            <TrustedBy />
            <HowItWorks />
            <FeaturesGrid />
            <CTA />
        </div>
    );
}
