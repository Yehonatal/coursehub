"use client";

import React, { useState } from "react";
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

interface CommentAuthor {
    name: string;
    avatar?: string;
}

interface Comment {
    id: string;
    author: CommentAuthor;
    content: string;
    timestamp: string;
    likes: number;
    dislikes: number;
    replies?: Comment[];
}

interface CommentsSectionProps {
    comments: Comment[];
    totalCount: number;
    className?: string;
}

function CommentItem({
    comment,
    isReply = false,
}: {
    comment: Comment;
    isReply?: boolean;
}) {
    return (
        <div className={cn("flex gap-4", isReply && "ml-12 mt-6")}>
            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                {comment.author.avatar ? (
                    <img
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
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
                    <button className="flex items-center gap-1.5 hover:text-[#0A251D] transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{comment.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-[#0A251D] transition-colors">
                        <ThumbsDown className="w-4 h-4" />
                        <span>{comment.dislikes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-[#0A251D] transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>Reply</span>
                    </button>
                    <button className="hover:text-[#0A251D] transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export function CommentsSection({
    comments,
    totalCount,
    className,
}: CommentsSectionProps) {
    return (
        <div className={cn("space-y-8", className)}>
            <div className="bg-gray-200/50 p-6 rounded-2xl space-y-4">
                <textarea
                    placeholder="Add comment..."
                    className="w-full bg-transparent border-none resize-none focus:ring-0 p-0 text-gray-700 placeholder:text-gray-500 min-h-[40px]"
                    rows={2}
                />
                <div className="flex justify-end">
                    <Button className="bg-[#0E7490] hover:bg-[#0891B2] text-white rounded-lg px-6 font-medium shadow-sm">
                        Submit
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-[#0A251D]">
                    Comments{" "}
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
                {comments.map((comment) => (
                    <div key={comment.id}>
                        <CommentItem comment={comment} />
                        {comment.replies?.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                isReply
                            />
                        ))}
                    </div>
                ))}
            </div>

            <div className="flex justify-center pt-4">
                <button className="flex items-center gap-2 text-[#0E7490] font-medium hover:underline">
                    Show more
                    <ChevronDown className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
