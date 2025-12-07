import { PageHeader } from "@/components/marketing/PageHeader";
import { FeaturesGrid } from "@/components/marketing/FeaturesGrid";
import { FeaturesForRoles } from "@/components/marketing/FeaturesForRoles";
import { ProductShowcase } from "@/components/marketing/ProductShowcase";
import { HandDrawnUnderline } from "@/components/ui/decorations";

export default function FeaturesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            <ProductShowcase />
            <FeaturesGrid />
            <FeaturesForRoles />
        </div>
    );
}
