import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="text-muted-foreground">
                We&apos;ve sent you a verification link. Please check your email
                to verify your account.
            </p>
            <Button asChild variant="outline">
                <Link href="/login">Back to Login</Link>
            </Button>
        </div>
    );
}
