"use client";

import React, { useState, useActionState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateUniversity } from "@/app/actions/university";
import { toast } from "sonner";
import {
    Loader2,
    Globe,
    Mail,
    MapPin,
    Info,
    Lock,
    ShieldCheck,
    Upload,
    Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

interface EditUniversityModalProps {
    isOpen: boolean;
    onClose: () => void;
    university: {
        id: number;
        name: string;
        description: string;
        website: string;
        email: string;
        location: string;
        logoUrl: string;
        bannerUrl?: string;
        isPrivate: boolean;
    };
}

const initialState = {
    success: false,
    message: "",
};

export function EditUniversityModal({
    isOpen,
    onClose,
    university,
}: EditUniversityModalProps) {
    const [state, formAction, isPending] = useActionState(
        updateUniversity,
        initialState
    );

    const [logoPreview, setLogoPreview] = useState<string | null>(
        university.logoUrl
    );
    const [bannerPreview, setBannerPreview] = useState<string | null>(
        university.bannerUrl || null
    );
    const [isPrivate, setIsPrivate] = useState(university.isPrivate);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            onClose();
        } else if (state.message) {
            toast.error(state.message);
        }
    }, [state, onClose]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-border/40 bg-card/95 backdrop-blur-xl">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

                <form action={formAction} className="relative">
                    <input
                        type="hidden"
                        name="universityId"
                        value={university.id}
                    />
                    <input
                        type="hidden"
                        name="isPrivate"
                        value={String(isPrivate)}
                    />

                    <DialogHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-serif font-bold text-primary">
                                    Edit University
                                </DialogTitle>
                                <DialogDescription className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                                    Manage {university.name} details
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-8 pt-4 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {/* Banner Upload */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                <ImageIcon className="h-3 w-3" /> Banner Image
                            </Label>
                            <div className="relative h-32 w-full rounded-2xl border-2 border-dashed border-border/40 overflow-hidden group transition-all hover:border-primary/40">
                                {bannerPreview ? (
                                    <Image
                                        src={bannerPreview}
                                        alt="Banner Preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40">
                                        <Upload className="h-8 w-8 mb-2" />
                                        <span className="text-xs font-medium">
                                            Upload Banner
                                        </span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    name="banner"
                                    accept="image/*"
                                    onChange={handleBannerChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="rounded-xl pointer-events-none"
                                    >
                                        Change Banner
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Logo Upload */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                    Logo
                                </Label>
                                <div className="relative h-24 w-24 rounded-2xl border-2 border-dashed border-border/40 overflow-hidden group transition-all hover:border-primary/40 shrink-0">
                                    {logoPreview ? (
                                        <Image
                                            src={logoPreview}
                                            alt="Logo Preview"
                                            fill
                                            className="object-contain p-2"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40">
                                            <Upload className="h-6 w-6 mb-1" />
                                            <span className="text-[10px] font-medium text-center px-1">
                                                Logo
                                            </span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        name="logo"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                        <ImageIcon className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                        <Info className="h-3 w-3" /> Brief
                                        Description
                                    </Label>
                                    <Textarea
                                        name="description"
                                        defaultValue={university.description}
                                        placeholder="Tell us about the university..."
                                        className="min-h-[100px] bg-background/50 border-border/40 focus:border-primary/40 transition-all resize-none rounded-2xl"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                    <Globe className="h-3 w-3" /> Official
                                    Website
                                </Label>
                                <Input
                                    name="website"
                                    defaultValue={university.website}
                                    placeholder="https://..."
                                    className="bg-background/50 border-border/40 focus:border-primary/40 transition-all rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                    <Mail className="h-3 w-3" /> Contact Email
                                </Label>
                                <Input
                                    name="email"
                                    defaultValue={university.email}
                                    placeholder="contact@uni.edu"
                                    className="bg-background/50 border-border/40 focus:border-primary/40 transition-all rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                                <MapPin className="h-3 w-3" /> Location
                            </Label>
                            <Input
                                name="location"
                                defaultValue={university.location}
                                placeholder="City, Country"
                                className="bg-background/50 border-border/40 focus:border-primary/40 transition-all rounded-xl"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold text-primary flex items-center gap-2">
                                    <Lock className="h-3.5 w-3.5" /> Private
                                    Community
                                </Label>
                                <p className="text-[10px] text-muted-foreground/60 font-medium">
                                    Only verified students can access resources
                                </p>
                            </div>
                            <Switch
                                checked={isPrivate}
                                onCheckedChange={setIsPrivate}
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-8 pt-4 bg-muted/30 border-t border-border/40">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="rounded-xl font-bold text-xs uppercase tracking-widest"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-8 font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
