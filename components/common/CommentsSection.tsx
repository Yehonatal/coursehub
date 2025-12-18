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
            <div className="w-10 h-10 rounded-xl bg-muted shrink-0 overflow-hidden border border-border">
                {comment.author.avatar ? (
                    <Image
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-linear-to-br from-muted to-muted/50 flex items-center justify-center">
                        <span className="text-xs font-bold text-muted-foreground">
                            {comment.author.name.charAt(0)}
                        </span>
                    </div>
                )}
            </div>
            <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-primary text-sm">
                        {comment.author.name}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {comment.timestamp}
                    </span>
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed">
                    {comment.content}
                </p>
                <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground pt-1">
                    <button
                        onClick={() => onReact(comment.id, "like")}
                        className={cn(
                            "flex items-center gap-1.5 transition-all hover:text-primary",
                            comment.userReaction === "like"
                                ? "text-primary"
                                : ""
                        )}
                    >
                        <ThumbsUp
                            className={cn(
                                "w-3.5 h-3.5",
                                comment.userReaction === "like" &&
                                    "fill-primary/10"
                            )}
                        />
                        <span>{comment.likes}</span>
                    </button>
                    <button
                        onClick={() => onReact(comment.id, "dislike")}
                        className={cn(
                            "flex items-center gap-1.5 transition-all hover:text-primary",
                            comment.userReaction === "dislike"
                                ? "text-primary"
                                : ""
                        )}
                    >
                        <ThumbsDown
                            className={cn(
                                "w-3.5 h-3.5",
                                comment.userReaction === "dislike" &&
                                    "fill-primary/10"
                            )}
                        />
                        <span>{comment.dislikes}</span>
                    </button>
                    <button
                        onClick={() => setReplying((prev) => !prev)}
                        className="flex items-center gap-1.5 hover:text-primary transition-all"
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply</span>
                    </button>
                    <button className="hover:text-primary transition-all">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                </div>

                {replying && (
                    <div className="mt-4 p-4 rounded-2xl bg-muted/50 border border-border space-y-3">
                        <textarea
                            placeholder="Write a reply..."
                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm resize-none placeholder:text-muted-foreground/50"
                            rows={2}
                            value={replyValue}
                            onChange={(e) => setReplyValue(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs font-bold uppercase tracking-wider h-8 rounded-xl"
                                onClick={() => {
                                    setReplying(false);
                                    setReplyValue("");
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                className="text-xs font-bold uppercase tracking-wider h-8 rounded-xl px-4"
                                onClick={handleReplyPost}
                            >
                                Reply
                            </Button>
                        </div>
                    </div>
                )}

                {comment.replies?.length ? (
                    <div className="space-y-6 mt-6 border-l-2 border-border/50 pl-6">
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
        <div className={cn("space-y-10", className)}>
            <div className="bg-card p-8 rounded-3xl border border-border space-y-4 relative overflow-hidden group shadow-sm">
                <div className="absolute inset-0 bg-linear-to-br from-primary/[0.02] via-transparent to-transparent" />
                <textarea
                    placeholder="Share your thoughts on this resource..."
                    className="w-full bg-transparent border-none resize-none focus:ring-0 p-0 text-foreground placeholder:text-muted-foreground/50 min-h-12 text-sm relative z-10"
                    rows={3}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <div className="flex justify-end relative z-10">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !value.trim()}
                        className="rounded-xl px-8 font-bold uppercase tracking-widest text-[10px] h-10 shadow-sm"
                    >
                        {loading ? "Posting..." : "Post Comment"}
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-serif font-semibold text-foreground tracking-tight">
                        Comments
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                        {totalCount}
                    </span>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    Most Recent
                    <ChevronDown className="w-3 h-3" />
                </button>
            </div>

            <div className="space-y-10">
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
