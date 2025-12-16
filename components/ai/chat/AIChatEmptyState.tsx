import React from "react";
import {
    Lightbulb,
    HelpCircle,
    FileText,
    Network,
    Presentation,
    Loader2,
} from "lucide-react";

interface AIChatEmptyStateProps {
    resourceTitle: string;
    resourceType: string;
    onCommand: (command: string) => void | Promise<void>;
    isParsing?: boolean;
}

export function AIChatEmptyState({
    resourceTitle,
    resourceType,
    onCommand,
    isParsing,
}: AIChatEmptyStateProps) {
    return (
        <div className="w-full flex flex-col items-end space-y-4 max-w-4xl mx-auto mt-auto">
            <div className="bg-white p-3 pr-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3 w-fit max-w-md transition-transform hover:scale-[1.02]">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
                    <Presentation className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                            {resourceTitle}
                        </h3>
                        {isParsing && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Loader2 className="w-3 h-3 animate-spin text-[#0A251D]" />
                                <span>Analyzing...</span>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                        {resourceType}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2">
                <button
                    onClick={() => onCommand("Make flashcards")}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all shadow-sm"
                >
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">
                        Make flashcards
                    </span>
                </button>
                <button
                    onClick={() => onCommand("Quiz me")}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all group shadow-sm"
                >
                    <HelpCircle className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                        Quiz me
                    </span>
                </button>
                <button
                    onClick={() => onCommand("Summarize this")}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group shadow-sm"
                >
                    <FileText className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                        Summarize this
                    </span>
                </button>
                <button
                    onClick={() => onCommand("Map this topic")}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all group shadow-sm"
                >
                    <Network className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                        Map this topic
                    </span>
                </button>
            </div>
        </div>
    );
}
