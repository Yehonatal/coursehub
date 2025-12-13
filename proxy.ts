import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth/session";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protected routes
    const protectedRoutes = ["/dashboard", "/ai", "/resources", "/university"];

    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (isProtected) {
        try {
            const { user } = await validateRequest();
            if (!user) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        } catch (error) {
            console.error("Middleware auth error:", error);
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
    ],
};
