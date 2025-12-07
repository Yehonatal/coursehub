import { PageHeader } from "@/components/marketing/PageHeader";
import { PricingPlans } from "@/components/marketing/PricingPlans";
import { PricingTable } from "@/components/marketing/PricingTable";
import { PricingTestimonial } from "@/components/marketing/PricingTestimonial";
import { HandDrawnUnderline } from "@/components/ui/decorations";

export default function PricingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            <PageHeader
                tag="Membership Plans"
                title={
                    <>
                        Invest in your{" "}
                        <HandDrawnUnderline className="text-[#F5A623]">
                            future
                        </HandDrawnUnderline>
                    </>
                }
                subtitle={
                    "Choose the plan that fits your learning needs. Upgrade anytime as your academic demands grow."
                }
            />
            <PricingPlans />
            <PricingTable />
            <PricingTestimonial />
        </div>
    );
}
