import React from "react";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import AOSInit from "@/utils/AOSInit";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <AOSInit />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
