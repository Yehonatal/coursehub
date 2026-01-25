"use client";

import React from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

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
                className={cn(
                    "w-full h-full block relative focus:outline-none cursor-zoom-in",
                    className,
                )}
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
                <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden border-none rounded-2xl bg-transparent shadow-2xl">
                    <VisuallyHidden.Root>
                        <DialogTitle>{alt || "Image Preview"}</DialogTitle>
                        <DialogDescription>
                            Full screen preview of {alt || "image"}
                        </DialogDescription>
                    </VisuallyHidden.Root>
                    <div className="relative bg-black/95 w-full h-[70vh] sm:h-[80vh] flex items-center justify-center">
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            className="object-contain"
                            priority
                            sizes="100vw"
                        />
                        <div className="absolute top-4 right-4 z-50">
                            <Button
                                variant="secondary"
                                size="icon"
                                className="rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/10"
                                onClick={() => setOpen(false)}
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
