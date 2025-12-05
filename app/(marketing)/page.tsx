import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
            <main className="flex flex-col items-center gap-8 p-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                    Welcome to Course Hub
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                    The centralized adaptive learning platform for Ethiopian
                    university students and educators.
                </p>
                <div className="flex gap-4">
                    <Link href="/login">
                        <Button size="lg">Sign In</Button>
                    </Link>
                    <Link href="/register">
                        <Button size="lg" variant="outline">
                            Register
                        </Button>
                    </Link>
                </div>
            </main>
        </div>
    );
}
