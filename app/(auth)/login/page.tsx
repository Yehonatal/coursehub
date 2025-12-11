import { LoginForm } from "@/components/auth/LoginForm";

export const dynamic = "force-static";

export default function LoginPage() {
    return (
        <div className="w-full">
            <LoginForm />
        </div>
    );
}
