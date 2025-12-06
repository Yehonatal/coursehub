"use client";

import React from "react";
import { Bell, MessageSquare, Star, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
    const notifications = [
        {
            id: 1,
            type: "comment",
            user: "Sarah Johnson",
            action: "commented on your resource",
            target: "Introduction to Software Engineering",
            time: "2 hours ago",
            read: false,
        },
        {
            id: 2,
            type: "like",
            user: "David Chen",
            action: "liked your post",
            target: "Data Structures Notes",
            time: "5 hours ago",
            read: true,
        },
        {
            id: 3,
            type: "follow",
            user: "Emily Wilson",
            action: "started following you",
            target: "",
            time: "1 day ago",
            read: true,
        },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case "comment":
                return <MessageSquare className="h-4 w-4 text-blue-500" />;
            case "like":
                return <Star className="h-4 w-4 text-yellow-500" />;
            case "follow":
                return <UserPlus className="h-4 w-4 text-green-500" />;
            default:
                return <Bell className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-serif font-bold text-[#0A251D]">
                    Notifications
                </h1>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                >
                    Mark all as read
                </Button>
            </div>

            <div className="space-y-2">
                {notifications.map((notification) => (
                    <Card
                        key={notification.id}
                        className={`p-4 flex items-start gap-4 transition-colors hover:bg-muted/50 ${
                            !notification.read
                                ? "bg-blue-50/50 border-blue-100"
                                : ""
                        }`}
                    >
                        <div className="h-10 w-10 rounded-full bg-white border border-border flex items-center justify-center shrink-0 shadow-sm">
                            {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#0A251D]">
                                <span className="font-bold">
                                    {notification.user}
                                </span>{" "}
                                {notification.action}{" "}
                                {notification.target && (
                                    <span className="font-medium text-blue-600">
                                        {notification.target}
                                    </span>
                                )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {notification.time}
                            </p>
                        </div>
                        {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
