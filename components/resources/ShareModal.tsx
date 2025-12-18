"use client";

import React, { useEffect, useState } from "react";
import { X, Share2, Copy, Check, Twitter, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    url: string;
}

export function ShareModal({ isOpen, onClose, title, url }: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const id = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(id);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handler);
            document.body.style.overflow = prev || "";
        };
    }, [isOpen, onClose]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("Link copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error(err);
            toast.error("Failed to copy link");
        }
    };

    const shareLinks = [
        {
            name: "X (Twitter)",
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                title
            )}&url=${encodeURIComponent(url)}`,
            color: "bg-black hover:bg-gray-800",
        },
        {
            name: "LinkedIn",
            icon: Linkedin,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                url
            )}`,
            color: "bg-[#0077b5] hover:bg-[#006396]",
        },
        {
            name: "Telegram",
            icon: Send,
            url: `https://t.me/share/url?url=${encodeURIComponent(
                url
            )}&text=${encodeURIComponent(title)}`,
            color: "bg-[#0088cc] hover:bg-[#0077b5]",
        },
    ];

    if (!isOpen || !mounted) return null;

    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="relative z-10 w-full max-w-[450px] bg-white border-border/50 shadow-2xl rounded-[2rem] overflow-hidden">
                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center">
                                <Share2 className="h-5 w-5 text-primary/70" />
                            </div>
                            <h2 className="text-xl font-serif font-semibold tracking-tight">
                                Share Resource
                            </h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="rounded-full hover:bg-primary/5 text-muted-foreground/40 hover:text-primary transition-colors"
                            aria-label="Close share modal"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4 justify-center">
                            {shareLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg ${link.color}`}
                                    title={`Share on ${link.name}`}
                                >
                                    <link.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>

                        <div className="space-y-2.5">
                            <p className="text-sm font-medium text-primary/80 ml-1">
                                Copy Link
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Input
                                        id="link"
                                        defaultValue={url}
                                        readOnly
                                        className="h-12 rounded-xl border-border/50 bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all pr-10"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    size="icon"
                                    className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/10 transition-all shrink-0"
                                    onClick={handleCopy}
                                >
                                    {copied ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <Copy className="w-5 h-5" />
                                    )}
                                    <span className="sr-only">Copy</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="w-full rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
