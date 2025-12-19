import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Folder, Upload } from "lucide-react";
import { UploadModal } from "@/components/dashboard/UploadModal";

export function QuickUploadCard() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="space-y-4" data-aos="fade-up" data-aos-delay="100">
                <div className="flex items-center gap-3 text-primary font-medium ml-1">
                    <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center">
                        <Folder className="h-4 w-4 fill-primary/20" />
                    </div>
                    <span className="font-serif font-semibold tracking-tight">
                        Upload File
                    </span>
                </div>
                <Card
                    className="p-10 border-dashed border rounded-3xl border-border bg-card flex flex-col items-center justify-center text-center gap-5 hover:bg-muted/10 hover:border-primary/30 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-xl hover:shadow-primary/5"
                    onClick={() => setIsModalOpen(true)}
                >
                    <div className="h-14 w-14 rounded-2xl bg-muted/50 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-500">
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
