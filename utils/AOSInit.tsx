"use client";

import { useEffect } from "react";
import "aos/dist/aos.css";

export const AOSInit = () => {
    useEffect(() => {
        const initAOS = async () => {
            const AOS = (await import("aos")).default;
            AOS.init({
                once: true,
                duration: 800,
                easing: "ease-out-cubic",
            });
        };

        initAOS();
    }, []);

    return null;
};
