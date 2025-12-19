import React from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

interface CommunityMember {
    user_id: string;
    first_name: string;
    last_name: string;
    headline: string | null;
    total_downloads: number;
    avg_rating: number;
}

interface UniversityCommunityProps {
    contributors: CommunityMember[];
}

export function UniversityCommunity({
    contributors,
}: UniversityCommunityProps) {
    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                    Community
                </p>
                <h3 className="text-xl font-serif font-bold text-primary tracking-tight">
                    Top Contributors
                </h3>
            </div>

            <div className="space-y-6">
                {contributors.map((member, index) => (
                    <div
                        key={member.user_id}
                        className="flex items-center gap-4 group cursor-pointer"
                    >
                        <div className="h-12 w-12 rounded-xl bg-card overflow-hidden relative shrink-0 border border-border group-hover:border-primary/20 transition-all">
                            <div className="w-full h-full bg-linear-to-br from-primary/5 to-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                {member.first_name[0]}
                                {member.last_name[0]}
                            </div>
                        </div>
                        <div className="space-y-0.5 flex-1">
                            <h4 className="text-sm font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                                {member.first_name} {member.last_name}
                            </h4>
                            <p className="text-[11px] text-muted-foreground/60 font-medium leading-tight">
                                {member.headline || "Contributor"}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-primary">
                                {member.total_downloads}
                            </div>
                            <div className="text-[8px] uppercase tracking-wider text-muted-foreground/60 font-bold">
                                Downloads
                            </div>
                        </div>
                    </div>
                ))}

                {contributors.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">
                        No contributors yet.
                    </p>
                )}
            </div>
        </div>
    );
}
