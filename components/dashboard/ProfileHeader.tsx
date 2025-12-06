import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HandDrawnShape } from "@/components/ui/decorations";

export function ProfileHeader() {
    return (
        <div className="relative mb-8">
            <div className="h-28 sm:h-40 w-full rounded-t-xl bg-[#4F46E5]/10 relative overflow-hidden border-x border-t border-border/60">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            "radial-gradient(#0A251D 1px, transparent 1px)",
                        backgroundSize: "10px 10px",
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20"></div>
            </div>

            <div className="px-4 sm:px-8 pb-4 relative">
                <div className="flex flex-col sm:flex-row items-start md:items-end justify-between gap-4">
                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 -mt-10 md:-mt-12 relative z-10">
                        <div className="h-20 w-20 md:h-32 md:w-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md relative">
                            <Image
                                src="https://github.com/shadcn.png"
                                alt="Profile"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="-mt-2 md:mt-16 space-y-1">
                            <h1 className="text-2xl font-serif font-bold text-[#0A251D]">
                                Yonatan Afewerk
                            </h1>
                            <p className="text-sm md:text-sm font-medium text-[#0A251D]">
                                SWE | @HRU | Full-Stack Developer
                            </p>
                            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                                <span>Student</span>
                                <span>•</span>
                                <span>Harar</span>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/university/haramaya-university"
                        className="flex items-center gap-3 mt-4 md:mt-0 hover:opacity-80 transition-opacity"
                    >
                        <div className="h-10 w-10 rounded-full bg-white border border-border flex items-center justify-center overflow-hidden relative">
                            <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center text-[10px] font-bold text-green-800">
                                HU
                            </div>
                        </div>
                        <div className="text-xs text-[#0A251D]">
                            <p className="font-bold">
                                Haramaya University, Software
                            </p>
                            <p>engineering</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
