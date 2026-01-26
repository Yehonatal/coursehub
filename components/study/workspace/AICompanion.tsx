"use client";

import { useState } from "react";
import {
    MessageSquare,
    BookOpen,
    Layers,
    HelpCircle,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlashcardGeneratorModal } from "./FlashcardGeneratorModal";
import { QuizGeneratorModal } from "./QuizGeneratorModal";
import { FlashcardModal } from "@/components/ai/FlashcardModal";
import { toast } from "sonner";
import { ChatTab } from "./tabs/ChatTab";
import { StudyGuideTab } from "./tabs/StudyGuideTab";
import { FlashcardsTab } from "./tabs/FlashcardsTab";
import { QuizTab } from "./tabs/QuizTab";

interface AICompanionProps {
    resourceId: string;
    resourceTitle: string;
}

export default function AICompanion({ resourceTitle }: AICompanionProps) {
    const [activeTab, setActiveTab] = useState("chat");
    const [inputValue, setInputValue] = useState("");

    // Modals state
    const [showFlashcardGen, setShowFlashcardGen] = useState(false);
    const [showQuizGen, setShowQuizGen] = useState(false);
    const [showFlashcardViewer, setShowFlashcardViewer] = useState(false);

    // Mock Data State
    const [studyGuides, setStudyGuides] = useState<any[]>([]);
    const [flashcardSets, setFlashcardSets] = useState<any[]>([]);
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [chatMessages, setChatMessages] = useState<any[]>([
        /* Initial message handled by ChatTab empty state */
    ]);
    const [isChatLoading, setIsChatLoading] = useState(false);

    // Study Guide Generation State
    const [studyGuideDetail, setStudyGuideDetail] = useState<
        "simple" | "detailed"
    >("detailed");
    const [isGeneratingGuide, setIsGeneratingGuide] = useState(false);
    const [viewingGuide, setViewingGuide] = useState<any | null>(null);

    const tabs = [
        {
            id: "chat",
            label: "Chat",
            icon: MessageSquare,
            color: "text-violet-500",
        },
        {
            id: "study_guide",
            label: "Study Guide",
            icon: BookOpen,
            color: "text-green-600",
        },
        {
            id: "flashcards",
            label: "Flashcards",
            icon: Layers,
            color: "text-blue-500",
        },
        {
            id: "quiz",
            label: "Quiz",
            icon: HelpCircle,
            color: "text-orange-500",
        },
    ];

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMsg = { role: "user", content: inputValue };
        setChatMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsChatLoading(true);

        // Mock response
        setTimeout(() => {
            setChatMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    content: `Based on **${resourceTitle}**, here is what I found regarding "${userMsg.content}":\n\nIt appears that this concept relates to the core themes discussed in section 2. Would you like me to generate a quiz on this specific topic?`,
                },
            ]);
            setIsChatLoading(false);
        }, 1500);
    };

    const handleGenerateGuide = async () => {
        setIsGeneratingGuide(true);
        setTimeout(() => {
            const newGuide = {
                id: Date.now().toString(),
                title: `${resourceTitle} - ${studyGuideDetail === "simple" ? "Brief" : "Complete"} Guide`,
                detail: studyGuideDetail,
                sections: Math.floor(Math.random() * 5) + 3,
                date: new Date(),
                content: `## ${resourceTitle} Study Guide\n\n### 1. Executive Summary\nThis document covers the fundamental principles of the subject matter. It is structured to provide a comprehensive overview.\n\n### 2. Key Terminology\n- **Concept A**: Definition and context.\n- **Concept B**: Important nuances to remember.\n\n### 3. Core Analysis\nThe material argues that *interconnectivity* is driven by two main factors...\n\n### 4. Conclusion\nTo master this topic, focus on the relationship between structure and function.`,
            };
            setStudyGuides((prev) => [newGuide, ...prev]);
            setIsGeneratingGuide(false);
            toast.success("Study guide generated!");
        }, 2000);
    };

    const handleGenerateFlashcards = async (count: number, depth: string) => {
        const newSet = {
            id: Date.now().toString(),
            title: `Set ${flashcardSets.length + 1}`,
            count,
            depth,
            date: new Date(),
            cards: Array(count)
                .fill(null)
                .map((_, i) => ({
                    front: `Key Concept #${i + 1} from ${resourceTitle}`,
                    back: `This is the detailed explanation for concept #${i + 1}. It connects to the broader themes of the material.`,
                })),
        };
        setFlashcardSets((prev) => [newSet, ...prev]);
        toast.success("Flashcards generated!");
        setShowFlashcardViewer(true);
    };

    const handleGenerateQuiz = async (config: any) => {
        const newQuiz = {
            id: Date.now().toString(),
            title: `Practice Quiz ${quizzes.length + 1}`,
            questions: config.count === "unlimited" ? 10 : config.count,
            type: config.types.join(", "),
            difficulty: config.difficulty,
            date: new Date(),
        };
        setQuizzes((prev) => [newQuiz, ...prev]);
        toast.success("Quiz generated!");
    };

    const suggestedQuestions = [
        "Summarize this document",
        "What are the main arguments?",
        "Create a timeline of events",
    ];

    return (
        <div className="flex flex-col h-full bg-background border-r border-border font-sans">
            <div className="p-4 border-b border-border shrink-0 bg-background space-y-4">
                <div className="flex justify-between items-center">
                    <h2
                        className="font-semibold text-base text-foreground truncate max-w-[80%] uppercase"
                        title={resourceTitle}
                    >
                        {resourceTitle}
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                        <Trash2 size={18} />
                    </Button>
                </div>

                <div className="flex p-1 bg-muted rounded-xl border border-border">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center justify-center gap-2 py-2 flex-1 rounded-lg text-xs font-medium transition-all ${
                                activeTab === tab.id
                                    ? "bg-card text-foreground shadow-sm border border-border/50"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            }`}
                        >
                            <tab.icon
                                size={14}
                                className={
                                    activeTab === tab.id
                                        ? tab.color
                                        : "text-muted-foreground/70"
                                }
                            />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col relative bg-muted/30">
                {activeTab === "chat" && (
                    <ChatTab
                        messages={chatMessages}
                        isLoading={isChatLoading}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        onSendMessage={handleSendMessage}
                        suggestedQuestions={suggestedQuestions}
                    />
                )}

                {activeTab === "study_guide" && (
                    <StudyGuideTab
                        guides={studyGuides}
                        viewingGuide={viewingGuide}
                        setViewingGuide={setViewingGuide}
                        studyGuideDetail={studyGuideDetail}
                        setStudyGuideDetail={setStudyGuideDetail}
                        isGenerating={isGeneratingGuide}
                        onGenerate={handleGenerateGuide}
                    />
                )}

                {activeTab === "flashcards" && (
                    <FlashcardsTab
                        sets={flashcardSets}
                        onOpenGenerator={() => setShowFlashcardGen(true)}
                        onViewCards={() => setShowFlashcardViewer(true)} // Mock integration just opens the general viewer
                    />
                )}

                {activeTab === "quiz" && (
                    <QuizTab
                        quizzes={quizzes}
                        onOpenGenerator={() => setShowQuizGen(true)}
                    />
                )}
            </div>

            <FlashcardGeneratorModal
                isOpen={showFlashcardGen}
                onClose={() => setShowFlashcardGen(false)}
                onGenerate={handleGenerateFlashcards}
            />

            <QuizGeneratorModal
                isOpen={showQuizGen}
                onClose={() => setShowQuizGen(false)}
                onGenerate={handleGenerateQuiz}
            />

            <FlashcardModal
                isOpen={showFlashcardViewer}
                onClose={() => setShowFlashcardViewer(false)}
                flashcards={
                    flashcardSets.length > 0 ? flashcardSets[0].cards : []
                }
                resourceTitle={resourceTitle}
            />
        </div>
    );
}
