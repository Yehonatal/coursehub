"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Twitter, Linkedin, Send } from "lucide-react";
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
            <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Share
                        </p>
                        <h2 className="text-xl font-semibold text-[#0A251D]">
                            Share Resource
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Close share modal"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex flex-col gap-4 py-4">
                    <div className="flex gap-2 justify-center">
                        {shareLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-3 rounded-full text-white transition-colors ${link.color}`}
                                title={`Share on ${link.name}`}
                            >
                                <link.icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Input
                                id="link"
                                defaultValue={url}
                                readOnly
                                className="h-9"
                            />
                        </div>
                        <Button
                            type="submit"
                            size="sm"
                            className="px-3"
                            onClick={handleCopy}
                        >
                            {copied ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <Copy className="w-4 h-4" />
                            )}
                            <span className="sr-only">Copy</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
