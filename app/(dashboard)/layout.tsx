import React from "react";
import { Header } from "@/components/dashboard/Header";
import { AOSInit } from "@/utils/AOSInit";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F9F9F9] font-sans text-foreground">
            <AOSInit />
            <Header />
            <main className="container mx-auto px-4 py-8 md:px-6">
                {children}
            </main>
        </div>
    );
}
