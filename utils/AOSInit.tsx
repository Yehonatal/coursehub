"use client";

import { useEffect } from "react";
import "aos/dist/aos.css";

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
            } catch (error) {
                console.error("Failed to initialize AOS:", error);
            }
        };

        initAOS();
    }, []);

    return null;
};

export default AOSInit;
