import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { error } from "@/lib/logger";
import { api } from "@/lib/api-client";

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
                const json = await api.resources.getRating(resourceId);
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
                const json = await api.resources.rate(resourceId, value);

                if (json.status === 401) return;
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
