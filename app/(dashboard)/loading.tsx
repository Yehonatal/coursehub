"use client";

import React from "react";

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7]">
            <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#0A251D] text-white shadow-lg">
                    <span className="text-4xl font-serif font-bold">H</span>
                </div>

                <h1 className="text-3xl font-serif font-bold text-[#0A251D]">
                    Course Hub
                </h1>

                <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-4 relative">
                    <div className="absolute inset-y-0 left-0 bg-[#0A251D] w-1/3 animate-[loading_1.5s_ease-in-out_infinite]"></div>
                </div>
            </div>
            <style jsx>{`
                @keyframes loading {
                    0% {
                        left: -35%;
                    }
                    100% {
                        left: 100%;
                    }
                }
            `}</style>
        </div>
    );
}
