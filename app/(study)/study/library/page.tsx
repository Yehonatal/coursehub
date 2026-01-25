import { validateRequest } from "@/lib/auth/session";
import { getUserResources } from "@/lib/dal/study";
import LibraryClient from "@/components/study/LibraryClient";
import { redirect } from "next/navigation";

export default async function LibraryPage() {
    const { user } = await validateRequest();

    if (!user) {
        redirect("/login");
    }

    const resources = await getUserResources(user.user_id);

    return <LibraryClient initialResources={resources} />;
}
