"use client";

import { HelpCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizTabProps {
    quizzes: any[];
    onOpenGenerator: () => void;
}

export function QuizTab({ quizzes, onOpenGenerator }: QuizTabProps) {
    return (
        <div className="h-full overflow-y-auto p-8 bg-muted/30">
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-foreground text-base mb-1">
                            Create Quiz
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Create effective quizzes with different question
                            types.
                        </p>
                    </div>
                    <Button
                        onClick={onOpenGenerator}
                        className="px-6 py-2 h-auto text-sm font-medium rounded-lg"
                    >
                        Generate
                    </Button>
                </div>
            </div>

            {quizzes.length > 0 && (
                <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">
                        YOUR QUIZZES
                    </h4>
                    <div className="space-y-3">
                        {quizzes.map((quiz) => (
                            <div
                                key={quiz.id}
                                className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                                        <HelpCircle size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-medium text-sm text-foreground truncate">
                                                {quiz.title}
                                            </h4>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-6 w-6 text-muted-foreground -mr-2 -mt-1 opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {quiz.questions} questions •{" "}
                                            {quiz.difficulty}
                                        </p>
                                        <div className="mt-3">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full text-xs h-8"
                                            >
                                                Start Quiz
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
