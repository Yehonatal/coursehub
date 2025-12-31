import React from "react";
import { UniversityHeader } from "@/components/dashboard/UniversityHeader";
import { UniversityStats } from "@/components/dashboard/UniversityStats";
import { UniversityCommunity } from "@/components/dashboard/UniversityCommunity";
import { ResourceCard } from "@/components/common/ResourceCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    getUniversityBySlug,
    getUniversityStats,
    getUniversityContributors,
    getUniversityResources,
} from "@/app/actions/university";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

export default async function UniversityPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const university = await getUniversityBySlug(slug);

    if (!university) {
        notFound();
    }

    const [
        stats,
        contributors,
        verifiedMaterials,
        recentMaterials,
        currentUser,
    ] = await Promise.all([
        getUniversityStats(university.university_id),
        getUniversityContributors(university.university_id),
        getUniversityResources(university.university_id, "verified"),
        getUniversityResources(university.university_id, "recent"),
        getCurrentUser(),
    ]);

    const isStaff =
        currentUser?.role === "educator" &&
        currentUser?.is_verified &&
        currentUser?.university_id === university.university_id;

    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="space-y-16">
                <UniversityHeader
                    universityId={university.university_id}
                    name={university.name}
                    description={university.description || ""}
                    type={
                        university.is_official
                            ? "Official Partner"
                            : "Public University"
                    }
                    website={university.website || ""}
                    logoUrl={university.logo_url || undefined}
                    bannerUrl={university.banner_url || undefined}
                    isStaff={isStaff}
                    email={university.email || ""}
                    location={university.location || ""}
                    isPrivate={university.is_private}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-8">
                        <UniversityStats
                            students={stats.students}
                            educators={stats.educators}
                            resources={stats.resources}
                            verified={stats.verified}
                        />
                    </div>
                    <div className="lg:col-span-4 pt-4">
                        <UniversityCommunity contributors={contributors} />
                    </div>
                </div>

                <div className="space-y-16">
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                                    Curated
                                </p>
                                <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary">
                                    Top Verified Materials
                                </h3>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-12 w-12 rounded-2xl border-border/40 text-primary hover:bg-primary/5 transition-all"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-12 w-12 rounded-2xl border-border/40 text-primary hover:bg-primary/5 transition-all"
                                >
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {verifiedMaterials.map((resource: any) => (
                                <ResourceCard
                                    key={resource.resource_id}
                                    id={resource.resource_id}
                                    title={resource.title}
                                    description={resource.description || ""}
                                    tags={resource.tags?.split(",") || []}
                                    downloads={resource.downloads_count}
                                    isAI={resource.is_ai}
                                    isVerified={resource.is_verified}
                                    rating={Number(resource.avg_rating)}
                                    reviews={Number(resource.reviews_count)}
                                    comments={Number(resource.comments_count)}
                                    fileUrl={resource.file_url}
                                    mimeType={resource.mime_type}
                                />
                            ))}
                            {verifiedMaterials.length === 0 && (
                                <p className="text-muted-foreground italic col-span-full">
                                    No verified materials yet.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                                Latest
                            </p>
                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary">
                                Recent Contributions
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {recentMaterials.map((resource: any) => (
                                <ResourceCard
                                    key={resource.resource_id}
                                    id={resource.resource_id}
                                    title={resource.title}
                                    description={resource.description || ""}
                                    tags={resource.tags?.split(",") || []}
                                    downloads={resource.downloads_count}
                                    isAI={resource.is_ai}
                                    isVerified={resource.is_verified}
                                    rating={Number(resource.avg_rating)}
                                    reviews={Number(resource.reviews_count)}
                                    comments={Number(resource.comments_count)}
                                    fileUrl={resource.file_url}
                                    mimeType={resource.mime_type}
                                />
                            ))}
                            {recentMaterials.length === 0 && (
                                <p className="text-muted-foreground italic col-span-full">
                                    No recent contributions yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
