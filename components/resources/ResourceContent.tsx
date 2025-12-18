import React from "react";
import { Clock, CheckCircle2 } from "lucide-react";

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

            <div className="prose prose-gray max-w-none text-muted-foreground leading-relaxed">
                <p>{description}</p>
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-foreground">
                    Learning Objectives:
                </h3>
                <ul className="space-y-3">
                    {objectives.map((item, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-3 text-muted-foreground"
                        >
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
