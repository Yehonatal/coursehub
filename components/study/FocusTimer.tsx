"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Timer, Play, Pause, RotateCcw, SkipForward, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { ModeToggle } from "@components/layout/ModeToggle";

export function FocusTimer() {
    const [open, setOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<"pomodoro" | "short" | "long">("pomodoro");

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Play sound?
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        if (mode === "pomodoro") setTimeLeft(25 * 60);
        else if (mode === "short") setTimeLeft(5 * 60);
        else setTimeLeft(15 * 60);
    };

    const changeMode = (newMode: "pomodoro" | "short" | "long") => {
        setMode(newMode);
        setIsActive(false);
        if (newMode === "pomodoro") setTimeLeft(25 * 60);
        else if (newMode === "short") setTimeLeft(5 * 60);
        else setTimeLeft(15 * 60);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex gap-2">
            <ModeToggle />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                        <Timer className="w-5 h-5" />
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
                    <div className="flex flex-col items-center justify-center p-6 space-y-8">
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={() => setOpen(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="text-center space-y-2">
                            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                                Focus Time
                            </h2>
                            <div className="text-8xl font-bold font-mono tracking-tighter text-foreground tabular-nums">
                                {formatTime(timeLeft)}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg">
                            <button
                                onClick={() => changeMode("pomodoro")}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                                    mode === "pomodoro"
                                        ? "bg-background shadow-sm text-foreground"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                Pomodoro
                            </button>
                            <button
                                onClick={() => changeMode("short")}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                                    mode === "short"
                                        ? "bg-background shadow-sm text-foreground"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                Short Break
                            </button>
                            <button
                                onClick={() => changeMode("long")}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                                    mode === "long"
                                        ? "bg-background shadow-sm text-foreground"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                Long Break
                            </button>
                        </div>

                        <div className="flex items-center gap-6">
                            <button
                                onClick={resetTimer}
                                className="p-3 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                            <button
                                onClick={toggleTimer}
                                className="p-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
                            >
                                {isActive ? (
                                    <Pause className="w-8 h-8 fill-current" />
                                ) : (
                                    <Play className="w-8 h-8 fill-current pl-1" />
                                )}
                            </button>
                            <button className="p-3 rounded-full hover:bg-muted text-muted-foreground transition-colors">
                                <SkipForward className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
