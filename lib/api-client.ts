import { error } from "./logger";

async function fetchApi<T = any>(
    url: string,
    options?: RequestInit
): Promise<{ success: boolean; data?: T; message?: string; status: number }> {
    try {
        const headers: Record<string, string> = {
            ...(options?.headers as Record<string, string>),
        };

        // Only set Content-Type to application/json if it's not FormData
        if (!(options?.body instanceof FormData) && !headers["Content-Type"]) {
            headers["Content-Type"] = "application/json";
        }

        const res = await fetch(url, {
            ...options,
            headers,
        });

        if (res.status === 401) {
            if (typeof window !== "undefined") {
                window.location.href = "/auth/login";
            }
            return { success: false, status: 401, message: "Unauthorized" };
        }

        const json = await res.json();

        // Ensure success is present
        const success = json.success !== undefined ? json.success : res.ok;
        const data =
            json.data !== undefined
                ? json.data
                : json.success !== undefined
                ? undefined
                : json;

        return {
            success,
            data,
            message: json.message,
            status: res.status,
        };
    } catch (err) {
        error(`API call to ${url} failed:`, err);
        return {
            success: false,
            status: 500,
            message: "Internal Server Error",
        };
    }
}

export const api = {
    resources: {
        getStats: (id: string) => fetchApi(`/api/resources/${id}/stats`),
        getRating: (id: string) => fetchApi(`/api/resources/${id}/rating`),
        rate: (id: string, value: number) =>
            fetchApi(`/api/resources/${id}/rating`, {
                method: "POST",
                body: JSON.stringify({ value }),
            }),
        getComments: (id: string) => fetchApi(`/api/resources/${id}/comments`),
        addComment: (id: string, content: string, parentId?: string) =>
            fetchApi(`/api/resources/${id}/comments`, {
                method: "POST",
                body: JSON.stringify({ content, parentId }),
            }),
        reactToComment: (
            resourceId: string,
            commentId: string,
            type: "like" | "dislike"
        ) =>
            fetchApi(
                `/api/resources/${resourceId}/comments/${commentId}/react`,
                {
                    method: "POST",
                    body: JSON.stringify({ type }),
                }
            ),
        report: (id: string, reason: string, details?: string) =>
            fetchApi(`/api/resources/${id}/report`, {
                method: "POST",
                body: JSON.stringify({ reason, details }),
            }),
    },
    ai: {
        parse: (formData: FormData) =>
            fetchApi("/api/ai/parse", {
                method: "POST",
                body: formData,
                headers: {},
            }),
    },
    auth: {
        signOut: () => fetchApi("/api/auth/signout", { method: "POST" }),
    },
    me: {
        get: () => fetchApi("/api/me"),
        delete: () => fetchApi("/api/me", { method: "DELETE" }),
    },
};
