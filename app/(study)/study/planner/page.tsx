"use client";

import React, { useState } from "react";
import {
    format,
    startOfWeek,
    addDays,
    startOfMonth,
    endOfMonth,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    getDay,
    isAfter,
    isBefore,
} from "date-fns";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    CheckCircle2,
    Circle,
    Calendar as CalendarIcon,
    MoreHorizontal,
    Clock,
    Tag,
    RefreshCcw,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type ViewMode = "day" | "week" | "month";

export default function PlannerPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>("month");
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [isIntegrationOpen, setIsIntegrationOpen] = useState(false);

    const nextPeriod = () => {
        if (viewMode === "month") setCurrentDate(addMonths(currentDate, 1));
        else if (viewMode === "week") setCurrentDate(addDays(currentDate, 7));
        else setCurrentDate(addDays(currentDate, 1));
    };

    const prevPeriod = () => {
        if (viewMode === "month") setCurrentDate(subMonths(currentDate, 1));
        else if (viewMode === "week") setCurrentDate(addDays(currentDate, -7));
        else setCurrentDate(addDays(currentDate, -1));
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
    };

    // --- Header ---
    const renderHeader = () => {
        const dateFormat = viewMode === "month" ? "MMMM yyyy" : "MMM d, yyyy";
        return (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold font-serif min-w-[200px]">
                        {format(currentDate, dateFormat)}
                    </h1>
                    <div className="flex items-center bg-muted/30 rounded-lg p-1 border border-border/50">
                        <button
                            onClick={prevPeriod}
                            className="p-1.5 hover:bg-background rounded-md transition-all shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={goToToday}
                            className="px-3 py-1 text-xs font-medium hover:bg-background rounded-md transition-all"
                        >
                            Today
                        </button>
                        <button
                            onClick={nextPeriod}
                            className="p-1.5 hover:bg-background rounded-md transition-all shadow-sm"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center bg-muted/30 rounded-lg p-1 border border-border/50">
                        {(["day", "week", "month"] as ViewMode[]).map(
                            (mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                                        viewMode === mode
                                            ? "bg-background shadow-sm text-foreground"
                                            : "text-muted-foreground hover:text-foreground",
                                    )}
                                >
                                    {mode}
                                </button>
                            ),
                        )}
                    </div>

                    <Dialog
                        open={isIntegrationOpen}
                        onOpenChange={setIsIntegrationOpen}
                    >
                        <DialogTrigger>
                            <button className="px-3 py-2 bg-background border border-border/60 hover:border-primary/40 rounded-lg text-xs font-medium transition-all shadow-sm flex items-center gap-2">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">
                                    Integration
                                </span>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                            <div className="p-6 pb-0 space-y-1">
                                <h3 className="text-xl font-semibold">
                                    Calendar Integration
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Import events from your calendar
                                </p>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <button className="flex flex-col items-center justify-center py-6 px-4 bg-muted/20 border-2 border-transparent hover:border-muted-foreground/20 hover:bg-muted/40 rounded-xl transition-all gap-3 overflow-hidden">
                                        <div className="h-10 w-10 flex items-center justify-center">
                                            <div
                                                className="w-8 h-8 rounded-full border-4 border-red-500/80 border-t-transparent border-b-transparent animate-spin-slow duration-[3s]"
                                                style={{ animation: "none" }}
                                            />
                                            <div className="absolute w-2 h-2 bg-red-500 rounded-full" />
                                        </div>
                                        <span className="text-sm font-medium">
                                            Canvas LMS
                                        </span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center py-6 px-4 bg-white border border-border shadow-sm hover:shadow-md rounded-xl transition-all gap-3">
                                        <div className="h-10 w-10 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold text-xl relative overflow-hidden">
                                            31
                                        </div>
                                        <span className="text-sm font-medium">
                                            Google Calendar
                                        </span>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-6 border-b border-border">
                                        <button className="pb-2 text-sm font-medium border-b-2 border-black">
                                            Upload Calendar File
                                        </button>
                                        <button className="pb-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                            Use API Token
                                        </button>
                                    </div>

                                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 space-y-3">
                                        <h4 className="font-medium text-sm text-foreground">
                                            How to export your Canvas calendar:
                                        </h4>
                                        <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside pl-1">
                                            <li>Go to Canvas Calendar</li>
                                            <li>
                                                Click the menu icon (three
                                                lines)
                                            </li>
                                            <li>Select "Calendar Feed"</li>
                                            <li>
                                                Copy the feed URL and open it in
                                                a new tab
                                            </li>
                                            <li>
                                                Save the page as a .ics file
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Calendar File (.ics)
                                        </label>
                                        <div className="flex items-center gap-3 px-3 py-2 border rounded-lg hover:bg-muted/10 transition-colors cursor-pointer bg-background">
                                            <span className="px-2 py-1 bg-muted rounded text-xs font-medium">
                                                Choose File
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                No file chosen
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            onClick={() =>
                                                setIsIntegrationOpen(false)
                                            }
                                            className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors">
                                            Import Calendar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={isAddTaskOpen}
                        onOpenChange={setIsAddTaskOpen}
                    >
                        <DialogTrigger>
                            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                                <Plus className="w-3.5 h-3.5" />
                                Add task
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="flex-1 p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">
                                            Create new task
                                        </h3>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Enter task
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Review design mockups, groceries at Erewhon.."
                                                className="w-full px-3 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-primary/10 outline-none text-sm transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Notes
                                            </label>
                                            <textarea
                                                placeholder="Add any additional notes..."
                                                rows={4}
                                                className="w-full px-3 py-2.5 rounded-lg border bg-background focus:ring-2 focus:ring-primary/10 outline-none text-sm resize-none transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Subtasks
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Add subtask..."
                                                    className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/10"
                                                />
                                                <button className="px-3 py-1 border rounded-lg text-xs font-medium hover:bg-muted transition-colors bg-white flex items-center gap-1 shrink-0">
                                                    <Plus className="w-3.5 h-3.5" />{" "}
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Tag
                                                    </label>
                                                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                                <div className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm flex items-center justify-between cursor-pointer hover:bg-muted/5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded bg-gray-200" />
                                                        <span>Life</span>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 rotate-90 text-muted-foreground" />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-muted-foreground">
                                                    Estimated Time
                                                </label>
                                                <div className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm flex items-center justify-between cursor-pointer hover:bg-muted/5">
                                                    <span>None</span>
                                                    <ChevronRight className="w-4 h-4 rotate-90 text-muted-foreground" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 flex justify-end">
                                        <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl shadow-primary/20">
                                            Add task
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t md:border-t-0 md:border-l border-border/60 p-6 w-full md:w-80 bg-muted/5">
                                    <div className="bg-background rounded-xl border border-border/50 shadow-sm p-4 mb-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <button className="p-1 hover:bg-muted rounded">
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <span className="text-sm font-semibold">
                                                January 2026
                                            </span>
                                            <button className="p-1 hover:bg-muted rounded">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                            {[
                                                "Su",
                                                "Mo",
                                                "Tu",
                                                "We",
                                                "Fr",
                                                "Sa",
                                            ].map((d) => (
                                                <span
                                                    key={d}
                                                    className="text-[10px] text-muted-foreground font-medium"
                                                >
                                                    {d}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-7 gap-1 text-center">
                                            {[...Array(4)].map((_, i) => (
                                                <span key={`empty-${i}`} />
                                            ))}
                                            {[1, 2, 3].map((d) => (
                                                <button
                                                    key={d}
                                                    className="h-8 w-8 text-xs rounded-full hover:bg-muted flex items-center justify-center"
                                                >
                                                    {d}
                                                </button>
                                            ))}
                                            {[
                                                4, 5, 6, 7, 8, 9, 10, 11, 12,
                                                13, 14, 15, 16, 17, 18, 19, 20,
                                                21, 22, 23, 24,
                                            ].map((d) => (
                                                <button
                                                    key={d}
                                                    className="h-8 w-8 text-xs rounded-full hover:bg-muted flex items-center justify-center"
                                                >
                                                    {d}
                                                </button>
                                            ))}
                                            <button className="h-8 w-8 text-xs rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                                                25
                                            </button>
                                            {[26, 27, 28, 29, 30, 31].map(
                                                (d) => (
                                                    <button
                                                        key={d}
                                                        className="h-8 w-8 text-xs rounded-full hover:bg-muted flex items-center justify-center"
                                                    >
                                                        {d}
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <button className="w-full flex items-center gap-3 p-2 bg-background border border-border/50 rounded-lg hover:border-primary/30 transition-all text-sm group text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            <span>No time set</span>
                                        </button>
                                        <button className="w-full flex items-center justify-between p-2 bg-background border border-border/50 rounded-lg hover:border-primary/30 transition-all text-sm group text-muted-foreground">
                                            <div className="flex items-center gap-3">
                                                <RefreshCcw className="w-4 h-4" />
                                                <span>Does not repeat</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 rotate-90" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        );
    };

    // --- Month View ---
    const renderMonthView = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;

        // Days Header
        const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (d) => (
                <div
                    key={d}
                    className="text-center text-xs font-semibold text-muted-foreground py-3 border-b border-border/50"
                >
                    {d}
                </div>
            ),
        );

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());

                days.push(
                    <div
                        key={day.toString()}
                        className={cn(
                            "h-24 sm:h-32 p-2 border-r border-b border-border/50 relative transition-all group hover:bg-muted/10 cursor-pointer",
                            !isCurrentMonth && "bg-muted/5",
                            isSelected && "bg-primary/5",
                            i === 6 && "border-r-0",
                        )}
                        onClick={() => setSelectedDate(cloneDay)}
                    >
                        <div className="flex justify-between items-start">
                            <span
                                className={cn(
                                    "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium transition-all",
                                    isToday
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : !isCurrentMonth
                                          ? "text-muted-foreground/40"
                                          : "text-muted-foreground group-hover:text-foreground",
                                )}
                            >
                                {format(day, "d")}
                            </span>
                        </div>
                        <div className="mt-2 space-y-1">
                            {getDay(day) === 1 && isCurrentMonth && (
                                <div className="text-[10px] bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded truncate border border-blue-200/20">
                                    Software Eng.
                                </div>
                            )}
                            {getDay(day) === 3 && isCurrentMonth && (
                                <div className="text-[10px] bg-orange-500/10 text-orange-600 px-1.5 py-0.5 rounded truncate border border-orange-200/20 flex gap-1 items-center">
                                    <Clock className="w-2 h-2" />
                                    <span>Wiki Quiz</span>
                                </div>
                            )}
                        </div>
                    </div>,
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div key={day.toString()} className="grid grid-cols-7">
                    {days}
                </div>,
            );
            days = [];
        }

        return (
            <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                <div className="grid grid-cols-7 bg-muted/20">{weekDays}</div>
                <div>{rows}</div>
            </div>
        );
    };

    const renderWeekView = () => {
        const startDate = startOfWeek(currentDate);
        const hours = Array.from({ length: 24 }, (_, i) => i);

        return (
            <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden h-[calc(100vh-250px)] flex flex-col animate-in fade-in zoom-in-95 duration-500">
                <div className="grid grid-cols-8 border-b border-border/50 bg-muted/20">
                    <div className="p-3 border-r border-border/50 text-center text-xs font-semibold text-muted-foreground self-center">
                        GMT+3
                    </div>
                    {Array.from({ length: 7 }).map((_, i) => {
                        const day = addDays(startDate, i);
                        const isToday = isSameDay(day, new Date());
                        return (
                            <div
                                key={i}
                                className={cn(
                                    "p-3 text-center border-r border-border/50 last:border-r-0",
                                    isToday && "bg-primary/5",
                                )}
                            >
                                <div
                                    className={cn(
                                        "text-xs font-medium mb-1",
                                        isToday
                                            ? "text-primary"
                                            : "text-muted-foreground",
                                    )}
                                >
                                    {format(day, "EEE")}
                                </div>
                                <div
                                    className={cn(
                                        "text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full mx-auto",
                                        isToday
                                            ? "bg-primary text-primary-foreground"
                                            : "",
                                    )}
                                >
                                    {format(day, "d")}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-8">
                        <div className="border-r border-border/50 bg-muted/5">
                            {hours.map((hour) => (
                                <div
                                    key={hour}
                                    className="h-20 border-b border-border/50 text-[10px] text-muted-foreground p-1 text-right relative"
                                >
                                    <span className="-top-2 relative">
                                        {format(
                                            new Date().setHours(hour, 0),
                                            "h a",
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {Array.from({ length: 7 }).map((_, i) => (
                            <div
                                key={i}
                                className="border-r border-border/50 last:border-r-0 relative"
                            >
                                {hours.map((hour) => (
                                    <div
                                        key={hour}
                                        className="h-20 border-b border-border/50"
                                    />
                                ))}

                                {i === 1 && (
                                    <div className="absolute top-[170px] left-1 right-1 h-[80px] bg-blue-500/10 border border-blue-500/30 rounded-md p-2 text-xs text-blue-700">
                                        <span className="font-semibold block">
                                            Software Engineering
                                        </span>
                                        <span className="opacity-75">
                                            10:00 - 11:30 AM
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full p-4 md:p-8 max-w-[1800px] mx-auto overflow-hidden">
            {renderHeader()}

            <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
                    {viewMode === "month" && renderMonthView()}
                    {(viewMode === "week" || viewMode === "day") &&
                        renderWeekView()}
                </div>

                <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 animate-in slide-in-from-right-4 duration-700">
                    <div className="bg-card rounded-xl border border-border/50 shadow-sm p-5 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">
                                {format(selectedDate, "MMMM d")}
                            </h3>
                            <div className="flex gap-2">
                                <button className="p-1 hover:bg-muted rounded">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                </button>
                                <button className="p-1 hover:bg-muted rounded">
                                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="w-full bg-muted/30 border border-border/50 rounded-lg py-2 px-3 text-sm focus:ring-1 focus:ring-primary/20 outline-none"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                                    Upcoming
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-3 p-3 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors group cursor-pointer bg-background">
                                        <Circle className="w-4 h-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium line-clamp-1">
                                                Read Chapter 3
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] px-1.5 py-0.5 bg-green-500/10 text-green-600 rounded">
                                                    Introduction to CS
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg border border-border/40 hover:bg-muted/30 transition-colors group cursor-pointer bg-background">
                                        <Circle className="w-4 h-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium line-clamp-1">
                                                Review Mockups
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-600 rounded">
                                                    Design
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    Tomorrow
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                                    Completed
                                </h4>
                                <div className="space-y-2 opacity-60">
                                    <div className="flex items-start gap-3 p-3 rounded-lg border border-transparent hover:bg-muted/30 transition-colors group cursor-pointer">
                                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium line-through decoration-muted-foreground text-muted-foreground">
                                                Submit Proposal
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsAddTaskOpen(true)}
                            className="mt-4 w-full py-2 border border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-primary rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
