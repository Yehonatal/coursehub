"use client";

import { useEffect } from "react";
import { trackResourceView } from "@/app/actions/resource-tracking";

export function ViewTracker({ resourceId }: { resourceId: string }) {
    useEffect(() => {
        trackResourceView(resourceId);
    }, [resourceId]);

    return null;
}
