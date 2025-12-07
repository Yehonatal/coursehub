import React from "react";

type ActionCardProps = {
    icon: React.ElementType;
    title: string;
    description: string;
};

export function ActionCard({
    icon: Icon,
    title,
    description,
}: ActionCardProps) {
    return (
        <div className="rounded-2xl border border-border bg-card/60 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-secondary/70 text-primary">
                    <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-semibold text-base text-foreground">
                    {title}
                </h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
            </p>
        </div>
    );
}
