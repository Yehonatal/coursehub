import React from "react";
import { ProfileHeader } from "@/components/dashboard/ProfileHeader";
import { ProfileStats } from "@/components/dashboard/ProfileStats";
import { ProfileRecents } from "@/components/dashboard/ProfileRecents";
import { MiniResourceGrid } from "@/components/dashboard/MiniResourceGrid";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { validateRequest } from "@/lib/auth/session";
import { getUserResources } from "@/lib/resources";
import { getUserProfileStats, listUserGenerations } from "@/app/actions/ai";

export const dynamic = "force-dynamic";

type MiniResourceItem = {
    id: string;
    title: string;
    rating: number;
    reviews: number;
    description: string;
    tags: string[];
    downloads: number;
    comments: number;
    isAI?: boolean;
    isVerified?: boolean;
    fileUrl?: string;
    mimeType?: string;
};

export default async function StudentProfilePage() {
    const { user } = await validateRequest();
    const stats = await getUserProfileStats();
    const generations = await listUserGenerations({ limit: 4 });

    let userResources: MiniResourceItem[] = [];
    if (user) {
        const resources = await getUserResources(user.user_id);
        userResources = resources.map((r) => ({
            id: r.resource_id,
            title: r.title,
            rating: r.rating || 0,
            reviews: r.reviews || 0,
            description: r.description || "",
            tags: r.tags,
            downloads: r.downloads || 0,
            comments: r.comments || 0,
            fileUrl: r.file_url,
            mimeType: r.mime_type || undefined,
        }));
    }

    return (
        <div className="max-w-7xl mx-auto pb-12 space-y-8 px-4 sm:px-6 lg:px-8">
            <ProfileHeader />
            <ProfileStats stats={stats} />
            <ProfileRecents generations={generations} />

            <div
                className="space-y-4"
                data-aos="fade-up"
                data-aos-delay="300"
                suppressHydrationWarning
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#0A251D]">
                        Most Popular Resources Posted
                    </h3>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-[#0A251D]/20 text-[#0A251D]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full border-[#0A251D]/20 text-[#0A251D]"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                {userResources.length ? (
                    <MiniResourceGrid resources={userResources} />
                ) : (
                    <div className="rounded-xl border border-dashed border-[#0A251D]/30 bg-white/60 p-6 text-sm text-[#0A251D]">
                        You haven’t uploaded any resources yet. Uploading a
                        resource will populate this list so you can easily
                        highlight it as one of your most popular contributions.
                    </div>
                )}
            </div>
        </div>
    );
}
