"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@/components/providers/UserProvider";
import { BadgeCheck, Pencil, MapPin } from "lucide-react";
import { EditProfileModal } from "@/components/dashboard/EditProfileModal";
import { SubscriptionBadge } from "@/components/common/SubscriptionBadge";

export function ProfileHeader() {
    const { user } = useUser();
    const [isEditOpen, setIsEditOpen] = useState(false);

    const displayName = user
        ? `${user.first_name} ${user.last_name}`
        : "Guest User";
    const displayRole = user?.role === "educator" ? "Educator" : "Student";
    const displayUniversity = user?.university || "No University";
    const displayLocation = "Addis Ababa, Ethiopia"; // Placeholder
    const displayAvatar =
        user?.profile_image_url || "https://github.com/shadcn.png";
    const displayBanner = user?.banner_url;

    return (
        <div className="relative mb-6">
            <EditProfileModal
                open={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                user={user}
            />
            <div className="h-24 sm:h-48 w-full rounded-3xl  relative overflow-hidden border border-border/50 ">
                {displayBanner ? (
                    <Image
                        src={displayBanner}
                        alt="Banner"
                        fill
                        className="object-cover opacity-90"
                    />
                ) : (
                    <>
                        <div
                            className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage: `
                                    linear-gradient(to right, currentColor 1px, transparent 1px),
                                    linear-gradient(to bottom, currentColor 1px, transparent 1px)
                                `,
                                backgroundSize: "40px 40px",
                            }}
                        ></div>

                        <div
                            className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Ffilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                            }}
                        ></div>
                    </>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-background/20 to-transparent"></div>

                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="px-6 sm:px-10 pb-10 relative ">
                <div className="flex flex-col sm:flex-row items-start md:items-end justify-between gap-4">
                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 -mt-8 md:-mt-12 relative z-10">
                        <div className="h-16 w-16 md:h-24 md:w-24 rounded-full border border-background bg-card overflow-hidden shadow-xl relative">
                            <Image
                                src={displayAvatar}
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="md:pb-1 space-y-0.5 md:mt-14">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-serif font-bold text-foreground tracking-tight">
                                        {displayName}
                                    </h1>
                                    {user?.is_verified && (
                                        <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-50" />
                                    )}
                                </div>

                                {user && (
                                    <div className="mt-2">
                                        <SubscriptionBadge
                                            status={user?.subscription_status}
                                        />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs md:text-sm font-medium text-muted-foreground/80 leading-relaxed">
                                {user?.headline ||
                                    `${displayRole} at ${displayUniversity}`}
                            </p>
                            <div className="flex items-center gap-3 text-[9px] md:text-[10px] text-muted-foreground/60 font-medium">
                                <span className="px-1.5 py-0.5 rounded-full bg-muted/50 border border-border">
                                    {displayRole}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-border" />
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {displayLocation}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3 md:mt-0 md:pb-2">
                        {user && (
                            <Button
                                size="icon"
                                variant="outline"
                                type="button"
                                onClick={() => setIsEditOpen(true)}
                                className="h-9 w-9 rounded-xl border-border/50 hover:bg-primary/5 hover:text-primary transition-all"
                            >
                                <Pencil className="h-3.5 w-3.5" />
                            </Button>
                        )}
                        {displayUniversity && (
                            <Link
                                href={`/university/${displayUniversity
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                                className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-muted/5 transition-all border border-transparent hover:border-border group"
                            >
                                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    {displayUniversity
                                        .substring(0, 2)
                                        .toUpperCase()}
                                </div>
                                <div className="space-y-0">
                                    <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                                        {displayUniversity}
                                    </p>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
