"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme =
    | "default"
    | "ocean"
    | "midnight"
    | "forest"
    | "dark"
    | "earth"
    | "github"
    | "pink";

interface ThemePreferences {
    fontSize: number;
    headingFont: string;
    bodyFont: string;
    radius: number;
    borderWidth: number;
    shadowIntensity: number;
}

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    preferences: ThemePreferences;
    updatePreference: <K extends keyof ThemePreferences>(
        key: K,
        value: ThemePreferences[K]
    ) => void;
}

const defaultPreferences: ThemePreferences = {
    fontSize: 16,
    headingFont: "var(--font-playfair)",
    bodyFont: "var(--font-geist-sans)",
    radius: 0.625,
    borderWidth: 1,
    shadowIntensity: 1,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("default");
    const [preferences, setPreferences] =
        useState<ThemePreferences>(defaultPreferences);

    useEffect(() => {
        const savedTheme = localStorage.getItem("app-theme") as Theme;
        const savedPrefs = localStorage.getItem("app-theme-prefs");

        if (savedTheme) {
            setThemeState(savedTheme);
            document.documentElement.setAttribute("data-theme", savedTheme);
            const isDark = ["midnight", "forest", "dark"].includes(savedTheme);
            if (isDark) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }

        if (savedPrefs) {
            const parsed = JSON.parse(savedPrefs);
            setPreferences(parsed);
            applyPreferences(parsed);
        } else {
            applyPreferences(defaultPreferences);
        }
    }, []);

    const applyPreferences = (prefs: ThemePreferences) => {
        const root = document.documentElement;
        root.style.setProperty("--base-font-size", `${prefs.fontSize}px`);
        root.style.setProperty("--font-heading", prefs.headingFont);
        root.style.setProperty("--font-body", prefs.bodyFont);
        root.style.setProperty("--radius", `${prefs.radius}rem`);
        root.style.setProperty("--border-w", `${prefs.borderWidth}px`);
        root.style.setProperty(
            "--shadow-intensity",
            `${prefs.shadowIntensity}`
        );
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem("app-theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);

        const isDark = ["midnight", "forest", "dark"].includes(newTheme);
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const updatePreference = <K extends keyof ThemePreferences>(
        key: K,
        value: ThemePreferences[K]
    ) => {
        const newPrefs = { ...preferences, [key]: value };
        setPreferences(newPrefs);
        localStorage.setItem("app-theme-prefs", JSON.stringify(newPrefs));
        applyPreferences(newPrefs);
    };

    return (
        <ThemeContext.Provider
            value={{ theme, setTheme, preferences, updatePreference }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
