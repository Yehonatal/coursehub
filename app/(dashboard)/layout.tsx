import React from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { SidebarWrapper } from "@/components/layout/SidebarWrapper";
import AOSInit from "@/utils/AOSInit";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F9F9F9] font-sans text-foreground pb-16 md:pb-0">
            <AOSInit />
            <Header />
            <main className="container mx-auto px-4 py-8 md:px-6">
                <SidebarWrapper>{children}</SidebarWrapper>
            </main>
            <BottomNav />
        </div>
    );
}
