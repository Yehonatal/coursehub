"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import {
    LayoutDashboard,
    Calendar,
    Library,
    BarChart2,
    ChevronDown,
    ChevronRight,
    Plus,
    PanelLeftClose,
    PanelLeftOpen,
    MoreHorizontal,
    Folder,
} from "lucide-react";
import { UserCourse } from "@/lib/dal/study";
import { CreateClassModal } from "@/components/study/CreateClassModal";

interface StudySidebarProps {
    courses: UserCourse[];
}

export function StudySidebar({ courses }: StudySidebarProps) {
    const pathname = usePathname();
    const [coursesOpen, setCoursesOpen] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { name: "Home", href: "/study/dashboard", icon: LayoutDashboard },
        { name: "Planner", href: "/study/planner", icon: Calendar },
        { name: "My Library", href: "/study/library", icon: Library },
        { name: "Progress", href: "/study/progress", icon: BarChart2 },
    ];

    return (
        <aside
            className={cn(
                "border-r bg-card flex flex-col h-full hidden md:flex transition-all duration-300 ease-in-out relative group",
                isCollapsed ? "w-20" : "w-72",
            )}
        >
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-6 h-6 w-6 bg-background border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors hover:shadow-md opacity-0 group-hover:opacity-100 z-10"
            >
                {isCollapsed ? (
                    <PanelLeftOpen className="w-3 h-3" />
                ) : (
                    <PanelLeftClose className="w-3 h-3" />
                )}
            </button>

            <div className="p-6">
                <div
                    className={cn(
                        "flex items-center gap-2 mb-8 transition-all overflow-hidden",
                        isCollapsed ? "justify-center" : "",
                    )}
                >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <span className="text-xl font-serif font-bold">H</span>
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-serif font-bold tracking-tight text-foreground whitespace-nowrap">
                            CourseHub
                        </span>
                    )}
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group/item",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                                    isCollapsed && "justify-center px-2",
                                )}
                                title={isCollapsed ? item.name : undefined}
                            >
                                <Icon
                                    className={cn(
                                        "w-5 h-5 shrink-0",
                                        isActive && "fill-current opacity-20",
                                    )}
                                />
                                {!isCollapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {!isCollapsed ? (
                <div className="px-4 py-2 mt-2 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-2 px-2">
                        <button
                            onClick={() => setCoursesOpen(!coursesOpen)}
                            className="text-xs font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wider flex items-center gap-1"
                        >
                            {coursesOpen ? (
                                <ChevronDown className="w-3 h-3" />
                            ) : (
                                <ChevronRight className="w-3 h-3" />
                            )}
                            My Classes
                        </button>
                        <CreateClassModal>
                            <button className="text-muted-foreground hover:text-primary transition-colors p-1 hover:bg-muted rounded">
                                <Plus className="w-4 h-4" />
                            </button>
                        </CreateClassModal>
                    </div>

                    {coursesOpen && (
                        <div className="space-y-1 mt-1">
                            {courses.length === 0 ? (
                                <CreateClassModal className="w-full">
                                    <div className="w-full px-2 py-4 text-center border-2 border-dashed border-muted rounded-lg hover:border-muted-foreground/50 transition-colors cursor-pointer group/empty">
                                        <p className="text-xs text-muted-foreground mb-2 group-hover/empty:text-foreground transition-colors">
                                            No classes yet
                                        </p>
                                        <span className="text-xs text-primary font-medium hover:underline">
                                            Add Class
                                        </span>
                                    </div>
                                </CreateClassModal>
                            ) : (
                                <>
                                    {courses.map((course) => (
                                        <Link
                                            key={course.course_id}
                                            href={`/study/classes/${course.course_id}`}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground",
                                                pathname?.includes(
                                                    course.course_id,
                                                ) && "bg-muted text-foreground",
                                            )}
                                        >
                                            <Folder
                                                className="w-4 h-4 shrink-0 transition-transform hover:scale-105"
                                                style={{
                                                    color:
                                                        course.color ||
                                                        "#3b82f6",
                                                }}
                                            />
                                            <span className="truncate">
                                                {course.name}
                                            </span>
                                        </Link>
                                    ))}
                                    <CreateClassModal className="w-full">
                                        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground w-full">
                                            <Plus className="w-4 h-4 shrink-0" />
                                            <span>Add class</span>
                                        </button>
                                    </CreateClassModal>
                                </>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-4 flex flex-col items-center gap-4 flex-1">
                    <div className="w-8 h-[1px] bg-border" />
                    {courses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/study/classes/${course.id}`}
                            title={course.course_name}
                        >
                            <span
                                className="w-3 h-3 rounded-full block border border-transparent hover:scale-125 transition-transform"
                                style={{
                                    backgroundColor:
                                        course.color_theme || "#3b82f6",
                                }}
                            />
                        </Link>
                    ))}
                    <CreateClassModal>
                        <button className="text-muted-foreground hover:text-primary">
                            <Plus className="w-5 h-5" />
                        </button>
                    </CreateClassModal>
                </div>
            )}

            <div className="p-4 border-t border-border/40">
                {!isCollapsed ? (
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted cursor-pointer transition-colors">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-background">
                            YA
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-foreground">
                                Yonatan A.
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                Free Plan
                            </p>
                        </div>
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer ring-2 ring-background">
                            YA
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
