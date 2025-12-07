import { PageHeader } from "@/components/marketing/PageHeader";
import { CommunityHighlights } from "@/components/marketing/CommunityHighlights";
import { HandDrawnCircle } from "@/components/ui/decorations";

export default function CommunityPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            <PageHeader
                tag="Our Network"
                title={
                    <>
                        A Thriving Academic{" "}
                        <HandDrawnCircle className="text-[#F5A623] -rotate-2">
                            Community
                        </HandDrawnCircle>
                    </>
                }
                subtitle={
                    "Join a network of students and educators dedicated to sharing knowledge and ensuring quality."
                }
            />
            <CommunityHighlights />
        </div>
    );
}
