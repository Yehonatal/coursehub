"use client";

import React from "react";

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7]">
            <div className="flex flex-col items-center gap-8 animate-in fade-in duration-700">
                <div className="flex items-center gap-1 select-none scale-110">
                    <span className="text-3xl font-bold text-[#0A251D] tracking-tighter font-sans">
                        Course Hub
                    </span>
                </div>

                <div className="w-48 h-1.5 bg-[#0A251D]/10 rounded-full overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 bg-[#0A251D] w-1/2 h-full rounded-full shimmer-bar"></div>
                </div>
            </div>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes shimmer {
                    0% { transform: translateX(-150%); }
                    100% { transform: translateX(250%); }
                }
                .shimmer-bar {
                    animation: shimmer 1.5s infinite ease-in-out;
                }
            `,
                }}
            />
        </div>
    );
}
