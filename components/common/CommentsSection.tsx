"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
    ThumbsUp,
    ThumbsDown,
    MessageSquare,
    MoreHorizontal,
    ArrowUpDown,
    ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { Comment, useResourceComments } from "@/hooks/useResourceComments";

interface CommentsSectionProps {
    initialComments: Comment[];
    initialCount: number;
    resourceId?: string;
    className?: string;
}

interface CommentItemProps {
    comment: Comment;
    depth?: number;
    onReact: (commentId: string, type: "like" | "dislike") => Promise<void>;
    onReply: (commentId: string, content: string) => Promise<boolean | void>;
}

function CommentItem({
    comment,
    depth = 0,
    onReact,
    onReply,
}: CommentItemProps) {
    const [replying, setReplying] = useState(false);
    const [replyValue, setReplyValue] = useState("");

    const handleReplyPost = async () => {
        if (!replyValue.trim()) return;
        const success = await onReply(comment.id, replyValue.trim());
        if (success) {
            setReplying(false);
            setReplyValue("");
        }
    };

    return (
        <div className={cn("flex gap-4", depth > 0 && "ml-12 mt-6")}>
            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                {comment.author.avatar ? (
                    <Image
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-linear-to-br from-gray-300 to-gray-400" />
                )}
            </div>
            <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0A251D]">
                        {comment.author.name}
                    </span>
                    <span className="text-sm text-gray-500">
                        {comment.timestamp}
                    </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                    {comment.content}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 pt-1">
                    <button
                        onClick={() => onReact(comment.id, "like")}
                        className={cn(
                            "flex items-center gap-1.5 transition-colors",
                            comment.userReaction === "like"
                                ? "text-[#0E7490] font-semibold"
                                : "hover:text-[#0A251D]"
                        )}
                    >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{comment.likes}</span>
                    </button>
                    <button
                        onClick={() => onReact(comment.id, "dislike")}
                        className={cn(
                            "flex items-center gap-1.5 transition-colors",
                            comment.userReaction === "dislike"
                                ? "text-[#0E7490] font-semibold"
                                : "hover:text-[#0A251D]"
                        )}
                    >
                        <ThumbsDown className="w-4 h-4" />
                        <span>{comment.dislikes}</span>
                    </button>
                    <button
                        onClick={() => setReplying((prev) => !prev)}
                        className="flex items-center gap-1.5 hover:text-[#0A251D] transition-colors"
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span>Reply</span>
                    </button>
                    <button className="hover:text-[#0A251D] transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>

                {replying && (
                    <div className="mt-3 space-y-2">
                        <textarea
                            placeholder="Write a reply..."
                            className="w-full bg-white border border-gray-200 rounded p-2 text-sm resize-none"
                            rows={2}
                            value={replyValue}
                            onChange={(e) => setReplyValue(e.target.value)}
                        />
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setReplying(false);
                                    setReplyValue("");
                                }}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleReplyPost}>Reply</Button>
                        </div>
                    </div>
                )}

                {comment.replies?.length ? (
                    <div className="space-y-6 mt-6">
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                depth={depth + 1}
                                onReact={onReact}
                                onReply={onReply}
                            />
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export function CommentsSection({
    initialComments,
    initialCount,
    resourceId,
    className,
}: CommentsSectionProps) {
    const [value, setValue] = useState("");
    const {
        comments,
        totalCount,
        loading,
        addComment,
        replyToComment,
        reactToComment,
    } = useResourceComments(resourceId, initialComments, initialCount);

    const handleSubmit = async () => {
        if (!value.trim()) return;
        const success = await addComment(value.trim());
        if (success) {
            setValue("");
        }
    };

    const sortedComments = useMemo(() => comments, [comments]);

    return (
        <div className={cn("space-y-8", className)}>
            <div className="bg-gray-200/50 p-6 rounded-2xl space-y-4">
                <textarea
                    placeholder="Add comment..."
                    className="w-full bg-transparent border-none resize-none focus:ring-0 p-0 text-gray-700 placeholder:text-gray-500 min-h-10"
                    rows={2}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <div className="flex justify-end">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !value.trim()}
                        className="bg-[#0E7490] hover:bg-[#0891B2] text-white rounded-lg px-6 font-medium shadow-sm"
                    >
                        {loading ? "Posting..." : "Submit"}
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-[#0A251D]">
                    Comments
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-sm ml-2">
                        {totalCount}
                    </span>
                </h2>
                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0A251D] font-medium">
                    <ArrowUpDown className="w-4 h-4" />
                    Most Recent
                    <ChevronDown className="w-3 h-3" />
                </button>
            </div>

            <div className="space-y-8">
                {sortedComments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        onReact={reactToComment}
                        onReply={replyToComment}
                    />
                ))}
            </div>
        </div>
    );
}
