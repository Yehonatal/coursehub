"use client";

import React, { useEffect, useState } from "react";
import {
    Bell,
    MessageSquare,
    Star,
    AlertTriangle,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    Notification,
} from "@/app/actions/notifications";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            const data = await getNotifications();
            setNotifications(data);
            setLoading(false);
        };
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id: number) => {
        const res = await markNotificationAsRead(id);
        if (res.success) {
            setNotifications((prev) =>
                prev.map((n) =>
                    n.notification_id === id ? { ...n, is_read: true } : n
                )
            );
        }
    };

    const handleMarkAllAsRead = async () => {
        const res = await markAllNotificationsAsRead();
        if (res.success) {
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, is_read: true }))
            );
            toast.success("All notifications marked as read");
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "comment":
            case "reply":
                return <MessageSquare className="h-5 w-5" />;
            case "rating":
                return <Star className="h-5 w-5" />;
            case "report":
                return <AlertTriangle className="h-5 w-5" />;
            default:
                return <Bell className="h-5 w-5" />;
        }
    };

    const getIconColor = (type: string, isRead: boolean) => {
        if (isRead) return "text-muted-foreground/30 bg-muted/10";
        switch (type) {
            case "comment":
            case "reply":
                return "text-blue-600/80 bg-blue-50/50";
            case "rating":
                return "text-amber-600/80 bg-amber-50/50";
            case "report":
                return "text-red-600/80 bg-red-50/50";
            default:
                return "text-primary/70 bg-primary/5";
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-48 space-y-6">
                <div className="relative">
                    <div className="h-10 w-10 rounded-full border-2 border-primary/10 border-t-primary animate-spin" />
                    <Bell className="h-4 w-4 text-primary/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-sm text-muted-foreground font-medium tracking-wide">
                    Loading your updates...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                <div className="space-y-1.5">
                    <h1 className="text-2xl font-serif font-semibold text-primary tracking-tight">
                        Notifications
                    </h1>
                    <p className="text-muted-foreground text-sm max-w-md">
                        Stay updated with your resource activity and community
                        interactions.
                    </p>
                </div>
                {notifications.some((n) => !n.is_read) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        className="text-primary/70 hover:text-primary hover:bg-primary/5 font-medium transition-all rounded-xl"
                    >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark all as read
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                {notifications.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 rounded-[2rem] border border-border/50 bg-white/40 backdrop-blur-sm">
                        <div className="h-20 w-20 rounded-full bg-white shadow-sm flex items-center justify-center border border-border/50">
                            <Bell className="h-10 w-10 text-primary/10" />
                        </div>
                        <div className="space-y-1.5 max-w-xs">
                            <p className="text-xl font-serif font-semibold text-primary/90">
                                All caught up!
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                You don't have any new notifications at the
                                moment.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {notifications.map((notification) => (
                            <Link
                                key={notification.notification_id}
                                href={notification.link || "#"}
                                onClick={() =>
                                    !notification.is_read &&
                                    handleMarkAsRead(
                                        notification.notification_id
                                    )
                                }
                                className="group block"
                            >
                                <Card
                                    className={`relative overflow-hidden p-5 flex items-start gap-5 transition-all duration-500 border-border/50 hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-2xl ${
                                        !notification.is_read
                                            ? "bg-white ring-1 ring-primary/5"
                                            : "bg-white/60 opacity-75"
                                    }`}
                                >
                                    {!notification.is_read && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/80" />
                                    )}

                                    <div
                                        className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 group-hover:scale-105 ${getIconColor(
                                            notification.event_type,
                                            notification.is_read
                                        )}`}
                                    >
                                        {React.cloneElement(
                                            getIcon(
                                                notification.event_type
                                            ) as React.ReactElement,
                                            {
                                                className: "h-5 w-5",
                                            }
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 py-0.5">
                                        <div className="flex items-start justify-between gap-4">
                                            <p
                                                className={`text-[15px] leading-relaxed ${
                                                    !notification.is_read
                                                        ? "font-semibold text-primary/90"
                                                        : "text-muted-foreground font-medium"
                                                }`}
                                            >
                                                {notification.message}
                                            </p>
                                            {!notification.is_read && (
                                                <span className="h-2 w-2 rounded-full bg-primary/60 mt-2 shrink-0 shadow-[0_0_8px_rgba(15,57,59,0.2)]" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 mt-2.5">
                                            <p className="text-[11px] font-semibold text-muted-foreground/50 flex items-center gap-2 uppercase tracking-wider">
                                                {formatDistanceToNow(
                                                    new Date(
                                                        notification.sent_date
                                                    ),
                                                    { addSuffix: true }
                                                )}
                                            </p>
                                            {notification.is_read && (
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/20">
                                                    Archived
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
