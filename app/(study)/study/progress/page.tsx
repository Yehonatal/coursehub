"use client";

import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    Legend,
} from "recharts";
import {
    Clock,
    Target,
    TrendingUp,
    Flame,
    Zap,
    Trophy,
    Timer,
    Brain,
} from "lucide-react";
import { cn } from "@/utils/cn";

// --- Dummy Data ---

const weeklyActivity = [
    { name: "Mon", hours: 4.5, focus: 85, tasks: 3 },
    { name: "Tue", hours: 6.2, focus: 92, tasks: 5 },
    { name: "Wed", hours: 3.8, focus: 78, tasks: 2 },
    { name: "Thu", hours: 7.5, focus: 95, tasks: 8 },
    { name: "Fri", hours: 5.0, focus: 88, tasks: 4 },
    { name: "Sat", hours: 8.5, focus: 90, tasks: 6 },
    { name: "Sun", hours: 2.5, focus: 70, tasks: 1 },
];

const subjectDistribution = [
    { name: "Algorithms", value: 35, color: "#3b82f6" }, // Blue
    { name: "Database", value: 25, color: "#8b5cf6" }, // Violet
    { name: "System Design", value: 20, color: "#f59e0b" }, // Amber
    { name: "Networking", value: 15, color: "#10b981" }, // Emerald
    { name: "Security", value: 5, color: "#ef4444" }, // Red
];

const skillRadar = [
    { subject: "Recall", A: 120, fullMark: 150 },
    { subject: "Speed", A: 98, fullMark: 150 },
    { subject: "Accuracy", A: 86, fullMark: 150 },
    { subject: "Consistency", A: 99, fullMark: 150 },
    { subject: "Focus", A: 85, fullMark: 150 },
    { subject: "Endurance", A: 65, fullMark: 150 },
];

const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendUp,
}: {
    title: string;
    value: string;
    subtitle: string;
    icon: any;
    trend: string;
    trendUp?: boolean;
}) => (
    <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
        <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
            <div className="flex items-center gap-2 text-xs">
                <span
                    className={cn(
                        "font-medium px-1.5 py-0.5 rounded",
                        trendUp
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-600",
                    )}
                >
                    {trend}
                </span>
                <span className="text-muted-foreground">{subtitle}</span>
            </div>
        </div>
        <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Icon className="w-5 h-5" />
        </div>
    </div>
);

export default function ProgressPage() {
    return (
        <div className="flex flex-col min-h-full bg-background/50 p-8 space-y-8 mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-serif font-bold tracking-tight">
                    Progress & Analytics
                </h1>
                <p className="text-muted-foreground">
                    Track your learning journey and study habits
                </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Study Time"
                    value="38.4h"
                    subtitle="vs last week"
                    trend="+12%"
                    trendUp={true}
                    icon={Clock}
                />
                <StatCard
                    title="Focus Score"
                    value="86/100"
                    subtitle="Avg daily score"
                    trend="+4%"
                    trendUp={true}
                    icon={Target}
                />
                <StatCard
                    title="Current Streak"
                    value="14 Days"
                    subtitle="Personal best: 21"
                    trend="Fire!"
                    trendUp={true}
                    icon={Flame}
                />
                <StatCard
                    title="Tasks Completed"
                    value="28"
                    subtitle="4 pending"
                    trend="-2%"
                    trendUp={false}
                    icon={Trophy}
                />
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto">
                {/* Study Activity Chart (Large) */}
                <div className="lg:col-span-2 bg-card border border-border/50 rounded-xl p-6 shadow-sm min-h-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold">
                                Study Activity
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Daily hours and focus intensity
                            </p>
                        </div>
                        <select className="bg-muted/50 border border-border rounded-lg text-sm px-3 py-1 outline-none">
                            <option>This Week</option>
                            <option>Last Week</option>
                            <option>This Month</option>
                        </select>
                    </div>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weeklyActivity}>
                                <defs>
                                    <linearGradient
                                        id="colorHours"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#3b82f6"
                                            stopOpacity={0.1}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#3b82f6"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        borderRadius: "12px",
                                        border: "1px solid #e5e7eb",
                                        boxShadow:
                                            "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="hours"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorHours)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject Distribution (Side) */}
                <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm flex flex-col min-h-[400px]">
                    <h3 className="text-lg font-semibold mb-1">
                        Focus Distribution
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        Time spent per subject
                    </p>

                    <div className="flex-1 relative min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={subjectDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {subjectDistribution.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <span className="text-2xl font-bold">100%</span>
                            <p className="text-xs text-muted-foreground">
                                Effort
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        {subjectDistribution.map((item) => (
                            <div
                                key={item.name}
                                className="flex items-center justify-between text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-muted-foreground">
                                        {item.name}
                                    </span>
                                </div>
                                <span className="font-medium">
                                    {item.value}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lower Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Radar Chart: Skills */}
                <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm min-h-[350px]">
                    <div className="flex items-center gap-2 mb-6">
                        <Brain className="w-5 h-5 text-purple-500" />
                        <h3 className="text-lg font-semibold">
                            Cognitive Stats
                        </h3>
                    </div>
                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart
                                cx="50%"
                                cy="50%"
                                outerRadius="80%"
                                data={skillRadar}
                            >
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis
                                    dataKey="subject"
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                />
                                <PolarAngleAxis />
                                <Radar
                                    name="Mike"
                                    dataKey="A"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    fill="#8b5cf6"
                                    fillOpacity={0.3}
                                />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Productivity Heatmap / Bar Chart */}
                <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm min-h-[350px]">
                    <div className="flex items-center gap-2 mb-6">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-lg font-semibold">
                            Weekly Productivity
                        </h3>
                    </div>
                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyActivity}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#e5e7eb"
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                />
                                <Tooltip
                                    cursor={{ fill: "transparent" }}
                                    contentStyle={{ borderRadius: "12px" }}
                                />
                                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                                <Bar
                                    dataKey="tasks"
                                    name="Tasks Completed"
                                    fill="#10b981"
                                    radius={[4, 4, 0, 0]}
                                    barSize={30}
                                />
                                <Bar
                                    dataKey="focus"
                                    name="Focus Score"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                    barSize={30}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
