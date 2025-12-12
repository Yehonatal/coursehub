import { LoginForm } from "@/components/auth/LoginForm";
import { Suspense } from "react";

export const dynamic = "force-static";

export default function LoginPage() {
    return (
        <div className="w-full">
            <Suspense>
                <LoginForm />
            </Suspense>
        </div>
    );
}
