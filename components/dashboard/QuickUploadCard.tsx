import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Folder, Upload } from "lucide-react";
import { UploadModal } from "@/components/dashboard/UploadModal";

export function QuickUploadCard() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="space-y-4" data-aos="fade-up" data-aos-delay="100">
                <div className="flex items-center gap-2 text-[#0A251D] font-medium">
                    <Folder className="h-5 w-5 fill-blue-400 text-blue-400" />
                    <span>Upload File</span>
                </div>
                <Card
                    className="p-8 border-dashed border-2 rounded-2xl border-border/60 bg-muted/30 flex flex-col items-center justify-center text-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => setIsModalOpen(true)}
                >
                    <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium">
                            Drag and drop or Browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Max file size 20MB
                        </p>
                    </div>
                </Card>
            </div>
            <UploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
