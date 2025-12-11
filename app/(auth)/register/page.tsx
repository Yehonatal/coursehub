import { RegisterForm } from "@/components/auth/RegisterForm";

export const dynamic = "force-static";

export default function RegisterPage() {
    return (
        <div className="w-full">
            <RegisterForm />
        </div>
    );
}
