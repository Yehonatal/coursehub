import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { HandDrawnShape } from "@/components/ui/decorations";

interface ProfileCardProps {
    name: string;
    role: string;
    university: string;
    department: string;
    location: string;
    avatarUrl: string;
}

export function ProfileCard({
    name,
    role,
    university,
    department,
    location,
    avatarUrl,
}: ProfileCardProps) {
    return (
        <Card
            className="overflow-hidden border-border/60 bg-white group transition-all duration-300"
            data-aos="fade-up"
        >
            <div className="h-24 bg-[#0A251D]/5 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            "radial-gradient(#0A251D 1px, transparent 1px)",
                        backgroundSize: "10px 10px",
                    }}
                ></div>
                <div className="absolute -right-4 -top-4 opacity-30 rotate-12 z-10">
                    <HandDrawnShape className="w-32 h-32 text-[#0A251D]" />
                </div>
            </div>
            <div className="px-6 pb-6 relative">
                <div className="h-20 w-20 rounded-full border-4 border-white bg-gray-200 absolute -top-24 overflow-hidden shadow-sm z-20">
                    <Image
                        src={avatarUrl}
                        alt="Profile"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="mt-12 space-y-1">
                    <h2 className="text-xl font-serif font-bold text-[#0A251D]">
                        {name}
                    </h2>
                    <p className="text-sm text-muted-foreground">{role}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium">
                            Student
                        </span>
                        <span>•</span>
                        <span>{location}</span>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border/40 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">
                        {university.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        <p className="font-medium text-foreground">
                            {university}
                        </p>
                        <p>{department}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
