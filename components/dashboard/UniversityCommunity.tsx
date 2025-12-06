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
            avatarUrl: "", // Empty string to trigger placeholder
        },
        {
            name: "Lidiya Alemayehu",
            role: "Student",
            description: "@HRU | Full-Stack Developer",
            avatarUrl: "", // Empty string to trigger placeholder
        },
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-sm font-medium text-muted-foreground">
                Best Content Uploader from this Community
            </h3>
            <div className="space-y-6">
                {members.map((member, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative shrink-0">
                            {member.avatarUrl ? (
                                <Image
                                    src={member.avatarUrl}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-300" />
                            )}
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="text-sm font-bold text-[#0A251D]">
                                {member.name}
                            </h4>
                            <p className="text-xs text-[#0A251D]">
                                {member.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {member.role}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="text-xs text-blue-500 font-medium flex items-center gap-1 hover:underline">
                Show more <ArrowDown className="h-3 w-3" />
            </button>
        </div>
    );
}
