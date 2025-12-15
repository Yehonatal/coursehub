"use client";

import { useEffect } from "react";
import { error } from "@/lib/logger";

const AOSInit = () => {
    useEffect(() => {
        const initAOS = async () => {
            try {
                const AOS = (await import("aos")).default;
                AOS.init({
                    once: true,
                    duration: 800,
                    easing: "ease-out-cubic",
                });
            } catch (err) {
                error("Failed to initialize AOS:", err);
            }
        };

        initAOS();
    }, []);

    return null;
};

export default AOSInit;
