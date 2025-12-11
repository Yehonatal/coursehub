import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { validateRequest } from "@/lib/auth/session";
import { UserProvider } from "@/components/providers/UserProvider";
import { User } from "@/app/types/user";

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
    const { user } = await validateRequest();

    return (
        <html lang="en">
            <body
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
