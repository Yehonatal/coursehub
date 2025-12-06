import React from "react";
import { ChevronLeft, ChevronRight, FileText, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RelatedResources() {
    return (
        <div className="space-y-6 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0A251D]">
                    Recommended Resources
                </h2>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Card
                        key={i}
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer border-gray-200"
                    >
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <Badge variant="verified" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 line-clamp-1">
                                    Advanced Algorithms
                                </h4>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>4.8 (56)</span>
                                </div>
                            </div>
                            <div className="flex gap-2 text-xs">
                                <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                                    CS301
                                </span>
                                <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                                    Slides
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
