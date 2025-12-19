import React from "react";

interface AppContainerProps {
    children: React.ReactNode;
    className?: string;
    maxWidthClass?: string; // allow override
}

export function AppContainer({
    children,
    className = "",
    maxWidthClass = "max-w-[1500px]",
}: AppContainerProps) {
    return (
        <div
            className={`${maxWidthClass} mx-auto w-full px-4 sm:px-6 lg:px-8 ${className}`}
        >
            {children}
        </div>
    );
}

export default AppContainer;
