import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// Force dynamic rendering for the entire app since we rely on session cookies
// in the root layout. This prevents build errors with static generation.
// export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "CourseHub - Centralized Adaptive Learning",
    description:
        "The centralized adaptive learning platform for Ethiopian university students and educators.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                // Suppress hydration warnings caused by browser extensions or theme providers
                // that modify the DOM before React hydrates.
                suppressHydrationWarning
                className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased`}
            >
                <Toaster />
                {children}
            </body>
        </html>
    );
}
