import { RegisterForm } from "@/components/auth/RegisterForm";
import { validateRequest } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
    const { user } = await validateRequest();
    if (user) {
        redirect("/dashboard");
    }

    return (
        <div className="w-full">
            <RegisterForm />
        </div>
    );
}
