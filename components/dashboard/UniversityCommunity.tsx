import React from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

interface CommunityMember {
    name: string;
    role: string;
    description: string;
    avatarUrl: string;
}

export function UniversityCommunity() {
    const members: CommunityMember[] = [
        {
            name: "Dr. Abdelgany Kebede",
            role: "Lecturer",
            description: "Specialization in User Interface Design",
            avatarUrl: "",
        },
        {
            name: "Lidiya Alemayehu",
            role: "Student",
            description: "@HRU | Full-Stack Developer",
            avatarUrl: "",
        },
    ];

    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold">
                    Community
                </p>
                <h3 className="text-xl font-serif font-bold text-primary tracking-tight">
                    Top Contributors
                </h3>
            </div>

            <div className="space-y-6">
                {members.map((member, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 group cursor-pointer"
                    >
                        <div className="h-12 w-12 rounded-xl bg-muted/30 overflow-hidden relative shrink-0 border border-border/20 group-hover:border-primary/20 transition-all">
                            {member.avatarUrl ? (
                                <Image
                                    src={member.avatarUrl}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-linear-to-br from-primary/5 to-primary/10 flex items-center justify-center text-primary/60 font-bold text-xs">
                                    {member.name.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="space-y-0.5 flex-1">
                            <h4 className="text-sm font-bold text-primary tracking-tight group-hover:text-primary/70 transition-colors">
                                {member.name}
                            </h4>
                            <p className="text-[11px] text-muted-foreground/60 font-medium leading-tight">
                                {member.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <button className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-colors">
                View All{" "}
                <ArrowDown className="h-3 w-3 group-hover:translate-y-0.5 transition-transform" />
            </button>
        </div>
    );
}
