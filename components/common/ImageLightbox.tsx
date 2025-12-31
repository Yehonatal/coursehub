"use client";

import React from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImageLightboxProps {
    src: string;
    alt?: string;
    className?: string;
    sizes?: string;
    priority?: boolean;
}

export function ImageLightbox({
    src,
    alt = "",
    className,
    sizes,
    priority,
}: ImageLightboxProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={
                    "w-full h-full block relative focus:outline-none " +
                    (className || "")
                }
                aria-label={`Open image preview: ${alt}`}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={sizes}
                    className="object-cover object-top"
                    priority={priority}
                />
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden border-none rounded-2xl">
                    <div className="relative bg-black/90 w-full h-[70vh] sm:h-[80vh] flex items-center justify-center">
                        <Image
                            src={src}
                            alt={alt}
                            width={1600}
                            height={900}
                            className="max-w-full max-h-full object-contain"
                        />
                        <div className="absolute top-3 right-3 z-50">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
