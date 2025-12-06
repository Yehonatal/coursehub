import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Upload } from "lucide-react";

export function AIUploadCard() {
    return (
        <Card
            className="p-6 space-y-6 border-border/60"
            data-aos="fade-left"
            data-aos-delay="400"
        >
            <div className="flex items-start gap-2 text-[#0A251D] font-medium">
                <Folder className="h-5 w-5 fill-blue-400 text-blue-400 " />
                <h3 className="font-serif font-bold">
                    Upload AI Generated Content
                </h3>
            </div>

            <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span>100 MB</span>
                <span>•</span>
                <span>Yesterday</span>
                <span>•</span>
                <span>13 Items</span>
            </div>

            <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                    Tree
                </span>
                <span className="px-2 py-1 bg-teal-50 text-teal-600 rounded text-xs font-medium">
                    Questions
                </span>
                <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs font-medium">
                    Note
                </span>
                <Button variant="link" className="text-xs h-auto p-0 ml-auto">
                    Edit
                </Button>
            </div>

            <div className="aspect-square rounded-xl bg-blue-50/50 border-2 border-dashed border-blue-200 flex flex-col items-center justify-center text-center p-4 gap-4 hover:bg-blue-50 transition-colors cursor-pointer group">
                <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Upload className="h-6 w-6 text-blue-500" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900">
                        Drag and drop or Browse
                    </p>
                    <p className="text-xs text-blue-400">Max file size 10MB</p>
                </div>
            </div>

            <div className="pt-4 border-t border-border/40">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Resource
                </h4>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-[#0A251D] rounded-full"></div>
                </div>
            </div>
        </Card>
    );
}
