"use client";

import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
    getNotificationPreferences,
    updateNotificationPreferences,
} from "@/app/actions/notifications";
import { Loader2, Mail, Smartphone } from "lucide-react";

export default function NotificationsSection() {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [prefs, setPrefs] = useState({
        emailNotifications: true,
        pushNotifications: false,
        resourceUpdates: true,
        commentReplies: true,
    });

    useEffect(() => {
        async function loadPrefs() {
            const data = await getNotificationPreferences();
            if (data) {
                setPrefs({
                    emailNotifications: data.emailNotifications,
                    pushNotifications: data.pushNotifications,
                    resourceUpdates: data.resourceUpdates,
                    commentReplies: data.commentReplies,
                });
            }
            setLoading(false);
        }
        loadPrefs();
    }, []);

    const handleToggle = async (key: string, value: boolean) => {
        if (key === "pushNotifications" && value) {
            // Request browser permission
            if (!("Notification" in window)) {
                toast.error(
                    "This browser does not support desktop notifications"
                );
                return;
            }

            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                toast.error("Notification permission denied");
                return;
            }
        }

        setUpdating(key);
        try {
            const res = await updateNotificationPreferences({ [key]: value });
            if (res.success) {
                setPrefs((prev) => ({ ...prev, [key]: value }));
                toast.success("Preference updated");
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Failed to update preference");
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <section id="notifications" className="scroll-mt-28">
            <div className="mb-8">
                <h2 className="text-2xl font-serif font-semibold text-primary tracking-tight">
                    Notifications
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                    Choose how you want to be notified about activity.
                </p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-md">
                    <div className="flex items-center gap-5">
                        <div className="h-11 w-11 rounded-xl bg-primary/5 flex items-center justify-center text-primary/70">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-semibold text-primary/90">
                                Email Notifications
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Receive updates and alerts via email.
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={prefs.emailNotifications}
                        onCheckedChange={(val: boolean) =>
                            handleToggle("emailNotifications", val)
                        }
                        disabled={updating === "emailNotifications"}
                    />
                </div>

                <div className="flex items-center justify-between p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-md">
                    <div className="flex items-center gap-5">
                        <div className="h-11 w-11 rounded-xl bg-primary/5 flex items-center justify-center text-primary/70">
                            <Smartphone className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-base font-semibold text-primary/90">
                                Push Notifications
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Get real-time alerts in your browser.
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={prefs.pushNotifications}
                        onCheckedChange={(val: boolean) =>
                            handleToggle("pushNotifications", val)
                        }
                        disabled={updating === "pushNotifications"}
                    />
                </div>

                <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-4">
                        Notification Events
                    </h4>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Resource Updates
                            </span>
                            <Switch
                                checked={prefs.resourceUpdates}
                                onCheckedChange={(val: boolean) =>
                                    handleToggle("resourceUpdates", val)
                                }
                                disabled={updating === "resourceUpdates"}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Comment Replies
                            </span>
                            <Switch
                                checked={prefs.commentReplies}
                                onCheckedChange={(val: boolean) =>
                                    handleToggle("commentReplies", val)
                                }
                                disabled={updating === "commentReplies"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
