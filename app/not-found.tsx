import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
            <h2 className="mb-4 text-2xl font-bold">Page Not Found</h2>
            <p className="mb-8 text-muted-foreground">
                Could not find requested resource
            </p>
            <Link
                href="/"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
                Return Home
            </Link>
        </div>
    );
}
