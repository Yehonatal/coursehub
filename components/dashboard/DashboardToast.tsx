"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export function DashboardToast() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const toastShownRef = useRef(false);

    useEffect(() => {
        const registered = searchParams.get("registered");
        if (registered && !toastShownRef.current) {
            toastShownRef.current = true;
            toast.message("Account created successfully", {
                description: "Please check your email to verify your account.",
                duration: 6000,
            });

            // Clean up the URL
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete("registered");
            const newPath = newParams.toString()
                ? `?${newParams.toString()}`
                : "";
            router.replace(`/dashboard${newPath}`);
        }
    }, [searchParams, router]);

    return null;
}
