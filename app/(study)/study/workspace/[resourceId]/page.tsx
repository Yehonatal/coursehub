import { validateRequest } from "@/lib/auth/session";
import { db } from "@/db";
import { resources } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import StudyWorkspace from "@/components/study/workspace/StudyWorkspace";

interface PageProps {
    params: Promise<{
        resourceId: string;
    }>;
}

export default async function WorkspacePage({ params }: PageProps) {
    const { user } = await validateRequest();
    const { resourceId } = await params;

    if (!user) {
        redirect("/login");
    }

    const [resource] = await db
        .select({
            resource_id: resources.resource_id,
            title: resources.title,
            file_url: resources.file_url,
            mime_type: resources.mime_type,
        })
        .from(resources)
        .where(eq(resources.resource_id, resourceId))
        .limit(1);

    if (!resource) {
        notFound();
    }

    return <StudyWorkspace resource={resource} />;
}
