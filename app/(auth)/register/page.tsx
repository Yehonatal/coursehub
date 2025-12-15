export const dynamic = "force-dynamic";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
    const session = await getSession();
    if (session) {
        redirect("/dashboard");
    }

    return (
        <div className="w-full">
            <RegisterForm />
        </div>
    );
}
