import { LoginForm } from "@/components/auth/LoginForm";
import { Suspense } from "react";
import { validateRequest } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
    const { user } = await validateRequest();
    if (user) {
        redirect("/dashboard");
    }

    return (
        <div className="w-full">
            <Suspense>
                <LoginForm />
            </Suspense>
        </div>
    );
}
