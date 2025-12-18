"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    createStudyNotes,
    createFlashcards,
    createKnowledgeTree,
} from "@/app/actions/ai";
import { AIStudyNote, AIFlashcard, AIKnowledgeNode } from "@/types/ai";
import { Loader2, FileText, Layers, Network } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/utils/cn";

export function AIStudyAssistant() {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState<AIStudyNote | null>(null);
    const [flashcards, setFlashcards] = useState<AIFlashcard[] | null>(null);
    const [tree, setTree] = useState<AIKnowledgeNode | null>(null);
    const [error, setError] = useState("");
    const [selectedModel, setSelectedModel] = useState<string | null>(null);

    // Read persisted model selection
    useEffect(() => {
        const m = localStorage.getItem("gemini_model");
        if (m) setSelectedModel(m);
    }, []);

    const handleGenerateNotes = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await createStudyNotes(
                content,
                undefined,
                selectedModel ?? undefined
            );
            setNotes(result);
        } catch (err: unknown) {
            setError((err as Error).message || "Failed to generate notes");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateFlashcards = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await createFlashcards(
                content,
                undefined,
                selectedModel ?? undefined
            );
            setFlashcards(result);
        } catch (err: unknown) {
            setError((err as Error).message || "Failed to generate flashcards");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateTree = async () => {
        setLoading(true);
        setError("");
        try {
            const result = await createKnowledgeTree(
                content,
                undefined,
                selectedModel ?? undefined
            );
            setTree(result);
        } catch (err: unknown) {
            setError(
                (err as Error).message || "Failed to generate knowledge tree"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>AI Study Assistant</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="Paste your study material here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[200px]"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </CardContent>
            </Card>

            <Tabs defaultValue="notes" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="notes">Study Notes</TabsTrigger>
                    <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                    <TabsTrigger value="tree">Knowledge Tree</TabsTrigger>
                </TabsList>

                <TabsContent value="notes" className="space-y-4">
                    <div className="flex justify-end">
                        <Button
                            onClick={handleGenerateNotes}
                            disabled={loading || !content}
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <FileText className="mr-2 h-4 w-4" />
                            )}
                            Generate Notes
                        </Button>
                    </div>
                    {notes && (
                        <Card className="border-l-4 border-l-primary">
                            <CardHeader>
                                <CardTitle className="text-2xl font-serif">
                                    {notes.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="bg-muted/50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2 text-primary flex items-center gap-2">
                                        <FileText className="h-4 w-4" /> Summary
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {notes.summary}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-3 text-primary flex items-center gap-2">
                                        <Layers className="h-4 w-4" /> Key
                                        Points
                                    </h3>
                                    <div className="grid gap-2">
                                        {notes.keyPoints.map((point, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-2 p-2 rounded hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                                                    {i + 1}
                                                </div>
                                                <span className="text-sm leading-relaxed">
                                                    {point}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-3 text-primary flex items-center gap-2">
                                        <Network className="h-4 w-4" /> Detailed
                                        Explanation
                                    </h3>
                                    <div className="prose dark:prose-invert max-w-none bg-card border rounded-lg p-6 shadow-sm">
                                        <ReactMarkdown>
                                            {notes.explanation}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="flashcards" className="space-y-4">
                    <div className="flex justify-end">
                        <Button
                            onClick={handleGenerateFlashcards}
                            disabled={loading || !content}
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Layers className="mr-2 h-4 w-4" />
                            )}
                            Generate Flashcards
                        </Button>
                    </div>
                    {flashcards && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {flashcards.map((card, i) => (
                                <Card
                                    key={i}
                                    className="hover:shadow-md transition-shadow"
                                >
                                    <CardContent className="p-6 space-y-4">
                                        <div>
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Front
                                            </span>
                                            <p className="font-medium mt-1">
                                                {card.front}
                                            </p>
                                        </div>
                                        <div className="pt-4 border-t">
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Back
                                            </span>
                                            <p className="mt-1 text-muted-foreground">
                                                {card.back}
                                            </p>
                                        </div>
                                        {card.tag && (
                                            <div className="pt-2">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                    {card.tag}
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="tree" className="space-y-4">
                    <div className="flex justify-end">
                        <Button
                            onClick={handleGenerateTree}
                            disabled={loading || !content}
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Network className="mr-2 h-4 w-4" />
                            )}
                            Generate Tree
                        </Button>
                    </div>
                    {tree && (
                        <Card>
                            <CardContent className="p-6">
                                <TreeRenderer node={tree} />
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function TreeRenderer({
    node,
    level = 0,
    isLast = true,
}: {
    node: AIKnowledgeNode;
    level?: number;
    isLast?: boolean;
}) {
    return (
        <div className="relative">
            <div
                className={cn(
                    "flex items-start gap-3 py-2 group transition-colors rounded-lg px-2",
                    level === 0 ? "bg-primary/5 mb-4" : "hover:bg-muted/50"
                )}
            >
                <div className="mt-1.5 relative">
                    <div
                        className={cn(
                            "w-3 h-3 rounded-full border-2 transition-colors",
                            level === 0
                                ? "bg-primary border-primary"
                                : "bg-background border-muted-foreground group-hover:border-primary group-hover:bg-primary/20"
                        )}
                    />
                    {node.children && node.children.length > 0 && (
                        <div className="absolute top-3 left-1.5 w-px h-[calc(100%+1rem)] bg-border group-hover:bg-primary/20 transition-colors" />
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span
                            className={cn(
                                "font-medium",
                                level === 0 ? "text-lg text-primary" : "text-sm"
                            )}
                        >
                            {node.label}
                        </span>
                        {node.children && node.children.length > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                                {node.children.length}
                            </span>
                        )}
                    </div>

                    {node.description && (
                        <p
                            className={cn(
                                "text-muted-foreground mt-0.5",
                                level === 0 ? "text-sm" : "text-xs"
                            )}
                        >
                            {node.description}
                        </p>
                    )}
                </div>
            </div>

            {node.children && node.children.length > 0 && (
                <div className="ml-1.5 pl-4 border-l border-border/50 space-y-1">
                    {node.children.map((child, index) => (
                        <TreeRenderer
                            key={child.id || index}
                            node={child}
                            level={level + 1}
                            isLast={index === node.children!.length - 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
