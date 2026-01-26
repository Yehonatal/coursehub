"use client";

import ResizableLayout from "./ResizableLayout";
import ResourceViewer from "./ResourceViewer";
import AICompanion from "./AICompanion";

interface StudyWorkspaceProps {
    resource: {
        resource_id: string;
        title: string;
        file_url: string;
        mime_type: string | null;
    };
}

export default function StudyWorkspace({ resource }: StudyWorkspaceProps) {
    return (
        <div className="h-full w-full bg-background overflow-hidden">
            <ResizableLayout
                leftContent={
                    <AICompanion
                        resourceId={resource.resource_id}
                        resourceTitle={resource.title}
                    />
                }
                rightContent={<ResourceViewer resource={resource} />}
            />
        </div>
    );
}
