export interface AIStudyNote {
    title: string;
    summary: string;
    keyPoints: string[];
    explanation: string;
}

export interface AIFlashcard {
    front: string;
    back: string;
    tag?: string;
}

export interface AIKnowledgeNode {
    id: string;
    label: string;
    description?: string;
    children?: AIKnowledgeNode[];
}

export interface AIResponse<T> {
    data: T;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
