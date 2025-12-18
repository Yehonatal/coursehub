"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ApiKeyModal } from "@/components/ai/ApiKeyModal";

export default function ApiSection() {
    const [showModal, setShowModal] = useState(false);

    // Start as null so server and client initial renders match. Read from
    // localStorage only on mount to avoid hydration mismatches.
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [model, setModel] = useState<string | null>(null);

    React.useEffect(() => {
        if (typeof window === "undefined") return;
        const key = localStorage.getItem("gemini_api_key");
        const storedModel = localStorage.getItem("gemini_model");
        if (key) setApiKey(key);
        if (storedModel) setModel(storedModel);
    }, []);

    const handleSave = (key: string, modelName?: string) => {
        setApiKey(key);
        setModel(modelName || null);
        localStorage.setItem("gemini_api_key", key);
        if (modelName) localStorage.setItem("gemini_model", modelName);
        setShowModal(false);
    };

    return (
        <section id="api" className="scroll-mt-28">
            <div className="mb-8">
                <h2 className="text-2xl font-serif font-semibold text-primary tracking-tight">
                    AI Configuration
                </h2>
                <p className="text-sm text-muted-foreground mt-1.5">
                    Configure your Gemini API keys and preferred AI models.
                </p>
            </div>

            <div className="p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-md">
                <div className="flex items-start justify-between gap-6">
                    <div className="space-y-6 flex-1">
                        <div className="space-y-2">
                            <h3 className="text-base font-semibold text-primary/90">
                                Gemini API Key
                            </h3>
                            <div className="flex items-center gap-2">
                                {apiKey ? (
                                    <code className="text-xs bg-primary/5 px-3 py-1.5 rounded-lg font-mono text-primary/80 border border-primary/10">
                                        ••••••••{apiKey.slice(-6)}
                                    </code>
                                ) : (
                                    <span className="text-sm text-muted-foreground italic">
                                        No key configured
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-base font-semibold text-primary/90">
                                Active Model
                            </h3>
                            <p className="text-sm text-muted-foreground font-medium">
                                {model || "gemini-2.5-flash-lite (default)"}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button
                            size="sm"
                            onClick={() => setShowModal(true)}
                            className="rounded-xl bg-primary text-primary-foreground font-semibold px-6"
                        >
                            {apiKey ? "Update Key" : "Configure"}
                        </Button>
                        {apiKey && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-xl text-destructive/70 hover:text-destructive hover:bg-destructive/5 font-medium"
                                onClick={() => {
                                    localStorage.removeItem("gemini_api_key");
                                    localStorage.removeItem("gemini_model");
                                    setApiKey(null);
                                    setModel(null);
                                }}
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <ApiKeyModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
                initialKey={apiKey ?? undefined}
                initialModel={model ?? undefined}
            />
        </section>
    );
}
