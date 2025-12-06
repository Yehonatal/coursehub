"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { QuickUploadCard } from "@/components/dashboard/QuickUploadCard";
import { AIUploadCard } from "@/components/dashboard/AIUploadCard";
import { cn } from "@/utils/cn";

export function MobileQuickActions() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"upload" | "ai">("upload");

    return (
        <div className="lg:hidden mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <Button
                    variant="outline"
                    className={cn(
                        "h-auto py-3 flex flex-col gap-1 border-dashed border-2",
                        isOpen && activeTab === "upload"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-border/60"
                    )}
                    onClick={() => {
                        if (isOpen && activeTab === "upload") {
                            setIsOpen(false);
                        } else {
                            setIsOpen(true);
                            setActiveTab("upload");
                        }
                    }}
                >
                    <Upload className="h-5 w-5 mb-1" />
                    <span className="text-xs font-bold">Upload File</span>
                    {isOpen && activeTab === "upload" ? (
                        <ChevronUp className="h-3 w-3 mt-1" />
                    ) : (
                        <ChevronDown className="h-3 w-3 mt-1" />
                    )}
                </Button>

                <Button
                    variant="outline"
                    className={cn(
                        "h-auto py-3 flex flex-col gap-1 border-dashed border-2",
                        isOpen && activeTab === "ai"
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-border/60"
                    )}
                    onClick={() => {
                        if (isOpen && activeTab === "ai") {
                            setIsOpen(false);
                        } else {
                            setIsOpen(true);
                            setActiveTab("ai");
                        }
                    }}
                >
                    <Sparkles className="h-5 w-5 mb-1" />
                    <span className="text-xs font-bold">AI Generate</span>
                    {isOpen && activeTab === "ai" ? (
                        <ChevronUp className="h-3 w-3 mt-1" />
                    ) : (
                        <ChevronDown className="h-3 w-3 mt-1" />
                    )}
                </Button>
            </div>

            {isOpen && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                    {activeTab === "upload" ? (
                        <QuickUploadCard />
                    ) : (
                        <AIUploadCard />
                    )}
                </div>
            )}
        </div>
    );
}
