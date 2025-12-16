import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { AIKnowledgeNode } from "@/types/ai";

interface AIKnowledgeTreeModalProps {
    isOpen: boolean;
    onClose: () => void;
    tree: AIKnowledgeNode | null;
}

export function AIKnowledgeTreeModal({
    isOpen,
    onClose,
    tree,
}: AIKnowledgeTreeModalProps) {
    if (!isOpen || !tree) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <Card className="w-full max-w-3xl max-h-[80vh] overflow-y-auto relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={onClose}
                >
                    <X className="h-4 w-4" />
                </Button>
                <CardHeader>
                    <CardTitle>Knowledge Tree</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <TreeRenderer node={tree} />
                </CardContent>
            </Card>
        </div>
    );
}

function TreeRenderer({
    node,
    level = 0,
}: {
    node: AIKnowledgeNode;
    level?: number;
}) {
    return (
        <div className="ml-4">
            <div className="flex items-center gap-2 py-1">
                <div
                    className={cn(
                        "w-2 h-2 rounded-full",
                        level === 0 ? "bg-primary" : "bg-muted-foreground"
                    )}
                />
                <span className="font-medium">{node.label}</span>
                {node.description && (
                    <span className="text-sm text-muted-foreground">
                        - {node.description}
                    </span>
                )}
            </div>
            {node.children && (
                <div className="border-l border-border ml-1 pl-4">
                    {node.children.map((child) => (
                        <TreeRenderer
                            key={child.id}
                            node={child}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
