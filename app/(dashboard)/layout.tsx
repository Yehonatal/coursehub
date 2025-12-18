import React, { Suspense } from "react";
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
            <div className="min-h-screen bg-background font-sans text-foreground pb-16 md:pb-0">
                <AOSInit />
                <Suspense
                    fallback={
                        <div className="h-20 w-full bg-card border-b border-border/40" />
                    }
                >
                    <Header />
                </Suspense>
                <main className="max-w-[1600px] mx-auto px-4 py-8 md:px-8">
                    <SidebarWrapper>{children}</SidebarWrapper>
                </main>
                <BottomNav />
            </div>
        </UserProvider>
    );
}
