import { useState, useCallback } from "react";
import { toast } from "sonner";
import { error } from "@/lib/logger";

export interface CommentAuthor {
    name: string;
    avatar?: string;
}

export interface Comment {
    id: string;
    author: CommentAuthor;
    content: string;
    timestamp: string;
    likes: number;
    dislikes: number;
    replies?: Comment[];
    userReaction?: "like" | "dislike" | null;
    parentId?: string | null;
}

export function useResourceComments(
    resourceId?: string,
    initialComments: Comment[] = [],
    initialCount: number = 0
) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [totalCount, setTotalCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);

    const addComment = useCallback(
        async (content: string) => {
            if (!resourceId) return;

            setLoading(true);
            try {
                const res = await fetch(
                    `/api/resources/${resourceId}/comments`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ content }),
                    }
                );

                if (res.status === 401) {
                    window.location.href = "/auth/login";
                    return;
                }

                const json = await res.json();
                if (!json.success) throw new Error(json.message);

                const newComment: Comment = {
                    id: json.data.id,
                    author: { name: json.data.author },
                    content: json.data.content,
                    timestamp: json.data.timestamp,
                    likes: 0,
                    dislikes: 0,
                    replies: [],
                    userReaction: null,
                };

                setComments((prev) => [newComment, ...prev]);
                setTotalCount((prev) => prev + 1);
                toast.success("Comment posted!");
                return true;
            } catch (err) {
                error("Failed to post comment:", err);
                toast.error("Failed to post comment");
                return false;
            } finally {
                setLoading(false);
            }
        },
        [resourceId]
    );

    const replyToComment = useCallback(
        async (parentId: string, content: string) => {
            if (!resourceId) return;

            try {
                const res = await fetch(
                    `/api/resources/${resourceId}/comments`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ content, parentId }),
                    }
                );

                if (res.status === 401) {
                    window.location.href = "/auth/login";
                    return;
                }

                const json = await res.json();
                if (!json.success) throw new Error(json.message);

                const newReply: Comment = {
                    id: json.data.id,
                    author: { name: json.data.author },
                    content: json.data.content,
                    timestamp: json.data.timestamp,
                    likes: 0,
                    dislikes: 0,
                    replies: [],
                    userReaction: null,
                    parentId,
                };

                setComments((prev) =>
                    prev.map((comment) => {
                        if (comment.id === parentId) {
                            return {
                                ...comment,
                                replies: [newReply, ...(comment.replies || [])],
                            };
                        }
                        return comment;
                    })
                );
                setTotalCount((prev) => prev + 1);
                toast.success("Reply posted!");
                return true;
            } catch (err) {
                error("Failed to reply:", err);
                toast.error("Failed to post reply");
                return false;
            }
        },
        [resourceId]
    );

    const reactToComment = useCallback(
        async (commentId: string, type: "like" | "dislike") => {
            if (!resourceId) return;

            // Optimistic update
            setComments((prev) => {
                const updateRecursive = (list: Comment[]): Comment[] => {
                    return list.map((c) => {
                        if (c.id === commentId) {
                            let newLikes = c.likes;
                            let newDislikes = c.dislikes;
                            let newReaction = c.userReaction;

                            if (c.userReaction === type) {
                                // Toggle off
                                if (type === "like") newLikes--;
                                else newDislikes--;
                                newReaction = null;
                            } else {
                                // Toggle on or switch
                                if (c.userReaction === "like") newLikes--;
                                if (c.userReaction === "dislike") newDislikes--;

                                if (type === "like") newLikes++;
                                else newDislikes++;
                                newReaction = type;
                            }

                            return {
                                ...c,
                                likes: newLikes,
                                dislikes: newDislikes,
                                userReaction: newReaction,
                            };
                        }
                        if (c.replies) {
                            return {
                                ...c,
                                replies: updateRecursive(c.replies),
                            };
                        }
                        return c;
                    });
                };
                return updateRecursive(prev);
            });

            try {
                const res = await fetch(
                    `/api/resources/${resourceId}/comments/${commentId}/react`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ type }),
                    }
                );

                if (res.status === 401) {
                    window.location.href = "/auth/login";
                    return;
                }

                const json = await res.json();
                if (!json.success) throw new Error(json.message);

                // Update state with server data (to ensure consistency)
                setComments((prev) => {
                    const updateRecursive = (list: Comment[]): Comment[] => {
                        return list.map((c) => {
                            if (c.id === commentId) {
                                return {
                                    ...c,
                                    likes: json.data.likes,
                                    dislikes: json.data.dislikes,
                                    userReaction: json.data.userReaction,
                                };
                            }
                            if (c.replies) {
                                return {
                                    ...c,
                                    replies: updateRecursive(c.replies),
                                };
                            }
                            return c;
                        });
                    };
                    return updateRecursive(prev);
                });
            } catch (err) {
                error("Failed to react:", err);
                toast.error("Failed to update reaction");
                // Ideally revert optimistic update here, but for simplicity we skip it
                // as the next fetch would correct it.
            }
        },
        [resourceId]
    );

    return {
        comments,
        totalCount,
        loading,
        addComment,
        replyToComment,
        reactToComment,
    };
}
