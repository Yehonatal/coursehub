import React from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { SidebarWrapper } from "@/components/layout/SidebarWrapper";
import AOSInit from "@/utils/AOSInit";
import { validateRequest } from "@/lib/auth/session";
import { UserProvider } from "@/components/providers/UserProvider";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = await validateRequest();

    return (
        <UserProvider user={user}>
            <div className="min-h-screen bg-[#F9F9F9] font-sans text-foreground pb-16 md:pb-0">
                <AOSInit />
                <Header />
                <main className="container mx-auto px-4 py-8 md:px-6">
                    <SidebarWrapper>{children}</SidebarWrapper>
                </main>
                <BottomNav />
            </div>
        </UserProvider>
    );
}
