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
                <h2 className="text-xl font-bold text-[#0A251D]">
                    Detailed Description
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                    <Clock className="w-4 h-4" />
                    <span>
                        Estimated Study Time:{" "}
                        <span className="font-semibold text-[#0A251D]">
                            {studyTime}
                        </span>
                    </span>
                </div>
            </div>

            <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
                <p>{description}</p>
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-gray-900">
                    Learning Objectives:
                </h3>
                <ul className="space-y-3">
                    {objectives.map((item, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-3 text-gray-600"
                        >
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
