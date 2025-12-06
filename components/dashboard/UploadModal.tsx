"use client";

import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
    const [dragActive, setDragActive] = useState(false);

    if (!isOpen) return null;

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl animate-in zoom-in-95 duration-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                    {/* Left Side - Form */}
                    <div className="p-6 lg:p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="title"
                                    className="text-gray-700"
                                >
                                    Title of Material
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="Full Title of Material"
                                    className="bg-white border-gray-200 focus:ring-blue-500/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="category"
                                    className="text-gray-700"
                                >
                                    Category
                                </Label>
                                <Input
                                    id="category"
                                    placeholder="Subject or Topic"
                                    className="bg-white border-gray-200 focus:ring-blue-500/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="description"
                                    className="text-gray-700"
                                >
                                    Description
                                </Label>
                                <textarea
                                    id="description"
                                    className="w-full min-h-[100px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                    placeholder="Brief Overview of the Material (Will be automatically generated if not included)"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="university"
                                    className="text-gray-700"
                                >
                                    University or Materials Creator
                                </Label>
                                <Input
                                    id="university"
                                    placeholder="Haramaya university"
                                    className="bg-white border-gray-200 focus:ring-blue-500/20"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-700">
                                        Select resource material type
                                    </Label>
                                    <Select
                                        className="bg-white border-gray-200 focus:ring-blue-500/20"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>
                                            Select type
                                        </option>
                                        <option value="slides">Slides</option>
                                        <option value="notes">Notes</option>
                                        <option value="exam">Exam</option>
                                        <option value="assignment">
                                            Assignment
                                        </option>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="courseCode"
                                        className="text-gray-700"
                                    >
                                        CourseCode
                                    </Label>
                                    <Input
                                        id="courseCode"
                                        placeholder="Course1324"
                                        className="bg-white border-gray-200 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags" className="text-gray-700">
                                    Tags
                                </Label>
                                <textarea
                                    id="tags"
                                    className="w-full min-h-20 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                    placeholder="Tags for this material (Will be automatically generated if not included)"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button
                                className="bg-[#A7F3D0] hover:bg-[#6EE7B7] text-[#064E3B] font-bold w-32 border-none shadow-sm"
                                onClick={onClose}
                            >
                                Submit
                            </Button>
                            <Button
                                variant="outline"
                                className="w-32 border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>

                    {/* Right Side - Upload Area */}
                    <div className="p-6 lg:p-8 flex flex-col items-center justify-center bg-gray-50/50">
                        <div
                            className={`w-full max-w-sm aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center p-8 gap-4 cursor-pointer transition-all duration-200 ${
                                dragActive
                                    ? "border-blue-500 bg-blue-50 scale-[1.02]"
                                    : "border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400"
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrag}
                        >
                            <div className="mb-2">
                                <Upload className="h-8 w-8 text-[#0A251D]" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-[#0A251D]">
                                    Drag and drop or Browse
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Max file size 20MB
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
