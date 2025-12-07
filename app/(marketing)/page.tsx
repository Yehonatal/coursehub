import { Hero } from "@/components/marketing/Hero";
import { EducatorInvite } from "@/components/marketing/EducatorInvite";
import { TrustedBy } from "@/components/marketing/TrustedBy";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { FeaturesGrid } from "@/components/marketing/FeaturesGrid";
import { CTA } from "@/components/marketing/CTA";

export default function LandingPage() {
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
