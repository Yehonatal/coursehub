import { LoginForm } from "@/components/auth/LoginForm";
import { Suspense } from "react";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await getSession();
    if (session) {
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
