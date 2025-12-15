import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { validateRequest } from "@/lib/auth/session";
import { UserProvider } from "@/components/providers/UserProvider";
import { User } from "@/app/types/user";

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
    // Wrap session validation in a try-catch block to handle potential errors gracefully
    // and prevent build failures during static generation.
    let user = null;
    try {
        const result = await validateRequest();
        user = result.user;
    } catch (error) {
        console.error("Failed to validate session in RootLayout:", error);
        // Continue rendering with null user
    }

    return (
        <html lang="en">
            <body
                // Suppress hydration warnings caused by browser extensions or theme providers
                // that modify the DOM before React hydrates.
                suppressHydrationWarning
                className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased`}
            >
                <UserProvider user={user as User | null}>
                    <Toaster />
                    {children}
                </UserProvider>
            </body>
        </html>
    );
}
