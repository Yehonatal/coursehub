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
                className="p-8 space-y-8 border border-border rounded-3xl sticky top-24 shadow-2xl shadow-primary/5 bg-card"
                data-aos="fade-left"
                data-aos-delay="400"
                suppressHydrationWarning
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Folder className="h-6 w-6 fill-primary/20 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-serif font-semibold text-lg text-foreground tracking-tight">
                                AI Generated Content
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                <span>100 MB</span>
                                <span className="h-1 w-1 rounded-full bg-muted-foreground/20" />
                                <span>13 Items</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Tree
                        </span>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Questions
                        </span>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Note
                        </span>
                    </div>

                    <div
                        className="aspect-square rounded-2xl bg-muted/30 border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-6 gap-5 hover:bg-muted/50 hover:border-primary/30 transition-all duration-300 cursor-pointer group"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <div className="h-14 w-14 rounded-2xl bg-card shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-500">
                            <Upload className="h-6 w-6 text-primary/40 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-sm font-semibold text-foreground">
                                Drag and drop or{" "}
                                <span className="text-primary underline decoration-primary/20 group-hover:decoration-primary transition-all">
                                    Browse
                                </span>
                            </p>
                            <p className="text-xs text-muted-foreground/60 font-medium">
                                Max file size 10MB
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                Storage Usage
                            </h4>
                            <span className="text-[10px] font-bold text-primary">
                                75%
                            </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-primary rounded-full"></div>
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
