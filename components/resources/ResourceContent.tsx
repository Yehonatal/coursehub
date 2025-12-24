import React from "react";
import { Clock, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

interface ResourceContentProps {
    description: string;
    studyTime: string;
    objectives: string[];
}

export function ResourceContent({
    description,
    studyTime,
    objectives,
}: ResourceContentProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-foreground">
                    Detailed Description
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                    <Clock className="w-4 h-4" />
                    <span>
                        Estimated Study Time:{" "}
                        <span className="font-semibold text-primary">
                            {studyTime}
                        </span>
                    </span>
                </div>
            </div>

            <div
                className="
                    prose
                    prose-slate
                    dark:prose-invert
                    max-w-none

                    prose-headings:font-serif
                    prose-headings:font-bold
                    prose-headings:tracking-tight

                    prose-p:text-muted-foreground
                    prose-p:leading-7
                    prose-p:my-4

                    prose-ol:list-decimal
                    prose-ul:list-disc
                    prose-ol:pl-8
                    prose-ul:pl-8
                    prose-li:my-2
                    prose-li:marker:text-primary
                    prose-li:marker:font-bold

                    prose-blockquote:border-l-primary
                    prose-blockquote:bg-muted/30
                    prose-blockquote:rounded-xl
                    prose-blockquote:px-6
                    prose-blockquote:py-3

                    prose-code:bg-muted/60
                    prose-code:px-1.5
                    prose-code:py-0.5
                    prose-code:rounded-md
                    prose-code:text-sm

                    prose-pre:bg-muted/50
                    prose-pre:border
                    prose-pre:border-border
                    prose-pre:rounded-2xl
                    prose-pre:p-4
                    prose-pre:overflow-x-auto

                    prose-table:border
                    prose-table:border-border
                    prose-th:bg-muted
                    prose-th:p-2
                    prose-td:p-2

                    prose-img:rounded-2xl
                "
            >
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    rehypePlugins={[rehypeRaw]}
                >
                    {description}
                </ReactMarkdown>
            </div>
        </div>
    );
}
