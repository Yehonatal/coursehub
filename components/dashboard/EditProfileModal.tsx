"use client";

import { useEffect, useState, useActionState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    X,
    Loader2,
    User as UserIcon,
    GraduationCap,
    Briefcase,
    Upload,
    Image as ImageIcon,
} from "lucide-react";
import type { User } from "@/app/types/user";
import { updateProfile } from "@/app/actions/profile";
import type { ActionResponse } from "@/app/actions/auth";
import Image from "next/image";

const initialActionState: ActionResponse = {
    success: false,
    message: "",
};

interface EditProfileModalProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
}

export function EditProfileModal({
    open,
    onClose,
    user,
}: EditProfileModalProps) {
    const [state, action, isPending] = useActionState(
        updateProfile,
        initialActionState
    );

    // Local state for inputs to allow editing
    const [firstName, setFirstName] = useState(user?.first_name ?? "");
    const [lastName, setLastName] = useState(user?.last_name ?? "");
    const [university, setUniversity] = useState(user?.university ?? "");
    const [headline, setHeadline] = useState(user?.headline ?? "");
    const [profilePreview, setProfilePreview] = useState<string | null>(
        user?.profile_image_url ?? null
    );
    const [bannerPreview, setBannerPreview] = useState<string | null>(
        user?.banner_url ?? null
    );

    useEffect(() => {
        if (open && user) {
            setFirstName(user.first_name ?? "");
            setLastName(user.last_name ?? "");
            setUniversity(user.university ?? "");
            setHeadline(user.headline ?? "");
            setProfilePreview(user.profile_image_url ?? null);
            setBannerPreview(user.banner_url ?? null);
        }
    }, [open, user]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePreview(reader.result as string);
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

    const hasNotifiedRef = useRef(false);
    useEffect(() => {
        if (!open) {
            hasNotifiedRef.current = false;
        }
    }, [open]);

    useEffect(() => {
        if (state.success && !hasNotifiedRef.current) {
            hasNotifiedRef.current = true;
            toast.success(state.message || "Profile updated", {
                description: "Your dashboard now reflects the latest info.",
            });
            onClose();
        } else if (
            state.message &&
            !state.success &&
            state.message !== "" &&
            !hasNotifiedRef.current
        ) {
            hasNotifiedRef.current = true;
            toast.error(state.message);
        }
    }, [state, onClose]);

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none bg-card rounded-3xl shadow-2xl">
                <div className="relative">
                    {/* Decorative Header Background */}
                    <div className="absolute inset-0 h-32 bg-linear-to-br from-primary/5 via-transparent to-transparent -z-10" />

                    <div className="px-8 pt-8 pb-6">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">
                                    Profile Settings
                                </p>
                                <DialogTitle className="text-2xl font-serif font-semibold text-primary tracking-tight">
                                    Update your details
                                </DialogTitle>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-full hover:bg-primary/5 text-muted-foreground/40 hover:text-primary transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {state.message && (
                            <div
                                className={`mb-6 p-4 rounded-2xl text-sm font-medium flex items-center gap-3 ${
                                    state.errors &&
                                    Object.keys(state.errors).length
                                        ? "bg-destructive/5 text-destructive border border-destructive/10"
                                        : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                }`}
                            >
                                <div
                                    className={`h-2 w-2 rounded-full shrink-0 ${
                                        state.errors &&
                                        Object.keys(state.errors).length
                                            ? "bg-destructive"
                                            : "bg-emerald-500"
                                    }`}
                                />
                                {state.message}
                            </div>
                        )}

                        <form action={action} className="space-y-6">
                            {/* Banner & Profile Image Upload */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 ml-1 mb-2 block">
                                        Profile Branding
                                    </Label>
                                    <div className="relative h-32 w-full rounded-2xl border-2 border-dashed border-border/40 overflow-hidden group transition-all hover:border-primary/40 bg-muted/5">
                                        {bannerPreview ? (
                                            <Image
                                                src={bannerPreview}
                                                alt="Banner Preview"
                                                fill
                                                className="object-cover"
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
                                            <ImageIcon className="h-6 w-6 text-white" />
                                        </div>
                                    </div>

                                    {/* Profile Image Overlay */}
                                    <div className="absolute -bottom-6 left-6 h-20 w-20 rounded-2xl border-4 border-card bg-card shadow-xl overflow-hidden group/profile z-30">
                                        {profilePreview ? (
                                            <Image
                                                src={profilePreview}
                                                alt="Profile Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground/40">
                                                <UserIcon className="h-8 w-8" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            name="profileImage"
                                            accept="image/*"
                                            onChange={handleProfileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/profile:opacity-100 transition-opacity flex items-center justify-center z-10">
                                            <Upload className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div className="h-6" />{" "}
                                {/* Spacer for profile image overlap */}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="firstName"
                                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 ml-1"
                                    >
                                        First Name
                                    </Label>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            value={firstName}
                                            onChange={(e) =>
                                                setFirstName(e.target.value)
                                            }
                                            className="pl-11 h-12 rounded-xl border-border/50 bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all"
                                            placeholder="John"
                                        />
                                    </div>
                                    {state.errors?.firstName && (
                                        <p className="text-[11px] text-destructive font-medium ml-1">
                                            {state.errors.firstName[0]}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="lastName"
                                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 ml-1"
                                    >
                                        Last Name
                                    </Label>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            value={lastName}
                                            onChange={(e) =>
                                                setLastName(e.target.value)
                                            }
                                            className="pl-11 h-12 rounded-xl border-border/50 bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all"
                                            placeholder="Doe"
                                        />
                                    </div>
                                    {state.errors?.lastName && (
                                        <p className="text-[11px] text-destructive font-medium ml-1">
                                            {state.errors.lastName[0]}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <Label
                                        htmlFor="headline"
                                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70"
                                    >
                                        Headline / Bio
                                    </Label>
                                    <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider">
                                        {headline.length}/150
                                    </span>
                                </div>
                                <div className="relative group">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="headline"
                                        name="headline"
                                        value={headline}
                                        onChange={(e) =>
                                            setHeadline(e.target.value)
                                        }
                                        className="pl-11 h-12 rounded-xl border-border/50 bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all"
                                        placeholder="Computer Science Student | AI Enthusiast"
                                    />
                                </div>
                                {state.errors?.headline && (
                                    <p className="text-[11px] text-destructive font-medium ml-1">
                                        {state.errors.headline[0]}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="university"
                                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 ml-1"
                                >
                                    University
                                </Label>
                                <div className="relative group">
                                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="university"
                                        name="university"
                                        value={university}
                                        onChange={(e) =>
                                            setUniversity(e.target.value)
                                        }
                                        className="pl-11 h-12 rounded-xl border-border/50 bg-muted/5 focus:border-primary/30 focus:ring-primary/5 transition-all"
                                        placeholder="Addis Ababa University"
                                    />
                                </div>
                                {state.errors?.university && (
                                    <p className="text-[11px] text-destructive font-medium ml-1">
                                        {state.errors.university[0]}
                                    </p>
                                )}
                            </div>

                            <div className="pt-4 flex items-center gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onClose}
                                    className="flex-1 h-12 rounded-xl font-medium hover:bg-muted/10"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-[2] h-12 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/10"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving changes...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
