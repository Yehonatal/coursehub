"use client";

import { useEffect, useState } from "react";

export type Stats = {
    rating: number;
    reviews: number;
    views: number;
    comments: number;
    downloads: number;
};

export function useResourceStats(resourceId?: string, refreshInterval = 15000) {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        let timer: ReturnType<typeof setTimeout> | null = null;

        async function load() {
            if (!resourceId) return;
            setLoading(true);
            try {
                const res = await fetch(`/api/resources/${resourceId}/stats`);
                const json = await res.json();
                if (mounted && json.success && json.data) {
                    setStats(json.data);
                }
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                if (mounted) setLoading(false);
                if (mounted && refreshInterval > 0) {
                    timer = setTimeout(load, refreshInterval);
                }
            }
        }

        load();

        return () => {
            mounted = false;
            if (timer) clearTimeout(timer);
        };
    }, [resourceId, refreshInterval]);

    return { stats, loading };
}
