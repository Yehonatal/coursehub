import { FeaturesGrid } from "@/components/marketing/FeaturesGrid";
import { FeaturesForRoles } from "@/components/marketing/FeaturesForRoles";
import { ProductShowcase } from "@/components/marketing/ProductShowcase";

export const dynamic = "force-static";

export default function FeaturesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            <ProductShowcase />
            <FeaturesGrid />
            <FeaturesForRoles />
        </div>
    );
}
