import React from "react";
import { FileText, HelpCircle, Network } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ResourceSidebar() {
    return (
        <div className="space-y-6">
            <div className="sticky top-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#0A251D]">
                        Generated Content
                    </h3>
                    <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                        View All
                    </span>
                </div>

                <div className="space-y-3">
                    <Card className="p-4 hover:border-blue-200 transition-colors cursor-pointer group">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#0A251D] text-sm">
                                    Summary Notes
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Concise overview of key concepts
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                    <span>45 min read</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 hover:border-yellow-200 transition-colors cursor-pointer group">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600 group-hover:bg-yellow-100 transition-colors">
                                <HelpCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#0A251D] text-sm">
                                    Practice Quiz
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Test your knowledge
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                    <span>35 questions</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 hover:border-green-200 transition-colors cursor-pointer group">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors">
                                <Network className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#0A251D] text-sm">
                                    Knowledge Graph
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Visual concept connections
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                    <span>20 nodes</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
