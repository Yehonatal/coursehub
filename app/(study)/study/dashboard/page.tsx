import { validateRequest } from "@/lib/auth/session";
import { getUserResources } from "@/lib/dal/study";
import DashboardClient from "@/components/study/DashboardClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const { user } = await validateRequest();

    if (!user) {
        redirect("/login");
    }

    // Fetch resources for "Recent Resources" section
    const resources = await getUserResources(user.user_id);

    return <DashboardClient recentResources={resources} />;
}
