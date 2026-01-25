import React from "react";
import { validateRequest } from "@/lib/auth/session";
import { UserProvider } from "@/components/providers/UserProvider";
import { redirect } from "next/navigation";
import { StudySidebar } from "@/components/layout/StudySidebar";
import { getUserCourses } from "@/lib/dal/study";

export default async function StudyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = await validateRequest();

    if (!user) {
        redirect("/login");
    }

    const courses = await getUserCourses(user.user_id);

    return (
        <UserProvider user={user}>
            <div className="flex h-screen bg-background overflow-hidden font-sans">
                <StudySidebar courses={courses} />

                <main className="flex-1 overflow-y-auto bg-background/50">
                    {children}
                </main>
            </div>
        </UserProvider>
    );
}
