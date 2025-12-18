"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Upload } from "lucide-react";
import { AIUploadModal } from "./AIUploadModal";

export function AIUploadCard() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Card
                className="p-8 space-y-8 border-none rounded-[2rem] sticky top-24 shadow-2xl shadow-primary/5 bg-white"
                data-aos="fade-left"
                data-aos-delay="400"
                suppressHydrationWarning
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <Folder className="h-6 w-6 fill-blue-500/20 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-serif font-semibold text-lg text-primary tracking-tight">
                                AI Generated Content
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                                <span>100 MB</span>
                                <span className="h-1 w-1 rounded-full bg-muted-foreground/20" />
                                <span>13 Items</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Tree
                        </span>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Questions
                        </span>
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Note
                        </span>
                    </div>

                    <div
                        className="aspect-square rounded-[1.5rem] bg-blue-50/30 border-2 border-dashed border-blue-100 flex flex-col items-center justify-center text-center p-6 gap-5 hover:bg-blue-50/50 hover:border-blue-300 transition-all duration-300 cursor-pointer group"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-500">
                            <Upload className="h-6 w-6 text-blue-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-sm font-semibold text-blue-900/80">
                                Drag and drop or{" "}
                                <span className="text-blue-600 underline decoration-blue-600/20 group-hover:decoration-blue-600 transition-all">
                                    Browse
                                </span>
                            </p>
                            <p className="text-xs text-blue-400/60 font-medium">
                                Max file size 10MB
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border/50">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                                Storage Usage
                            </h4>
                            <span className="text-[10px] font-bold text-primary/60">
                                75%
                            </span>
                        </div>
                        <div className="h-1.5 bg-muted/10 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-primary rounded-full shadow-[0_0_8px_rgba(10,37,29,0.2)]"></div>
                        </div>
                    </div>
                </div>
            </Card>
            <AIUploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
