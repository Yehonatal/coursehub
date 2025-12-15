import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { error } from "@/lib/logger";

interface RatingData {
    average: number;
    count: number;
    userRating: number | null;
}

export function useResourceRating(
    resourceId?: string,
    initialRating?: number,
    initialCount?: number
) {
    const [ratingData, setRatingData] = useState<RatingData>({
        average: initialRating || 0,
        count: initialCount || 0,
        userRating: null,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!resourceId) return;

        const fetchRating = async () => {
            try {
                const res = await fetch(`/api/resources/${resourceId}/rating`);
                const json = await res.json();
                if (json.success && json.data) {
                    setRatingData(json.data);
                }
            } catch (err) {
                error("Failed to fetch rating:", err);
            }
        };

        fetchRating();
    }, [resourceId]);

    const submitRating = useCallback(
        async (value: number) => {
            if (!resourceId) return;

            setLoading(true);
            // Optimistic update
            const previousData = { ...ratingData };
            setRatingData((prev) => ({
                ...prev,
                userRating: value,
            }));

            try {
                const res = await fetch(`/api/resources/${resourceId}/rating`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ value }),
                });

                if (res.status === 401) {
                    window.location.href = "/auth/login";
                    return;
                }

                const json = await res.json();
                if (!json.success) throw new Error(json.message);

                setRatingData({
                    average: json.data.average,
                    count: json.data.count,
                    userRating: json.data.userRating,
                });
                toast.success("Rating submitted!");
            } catch (err) {
                error("Failed to submit rating:", err);
                setRatingData(previousData); // Revert on error
                toast.error("Failed to submit rating");
            } finally {
                setLoading(false);
            }
        },
        [resourceId, ratingData]
    );

    return {
        ...ratingData,
        loading,
        submitRating,
    };
}
